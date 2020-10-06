import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
// 3rd party
import { Terminal, ITerminalOptions } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { RxStompService } from '@stomp/ng2-stompjs';
// relative
import { SessionResponse } from '../../../@core/model';
import { RESPONSE_CONSOLE } from '../channel';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-terminal',
  template: `
  <section class="terminal-container">
  <div class="xterm" #terminal>
  </div>
  <div class="action-icon-container">
    <mat-icon class="action-icon" (click)="ClearAll()">clear_all</mat-icon>
    <mat-icon class="action-icon" (click)="CloseTerminal()">close</mat-icon>
  </div>
  </section>
  `,
  styleUrls: ['terminal.component.scss']
})
export class TerminalComponent implements AfterViewInit, OnDestroy, OnInit {

  @Output()
  toggleTerminal = new EventEmitter<void>();

  @Input()
  user = 'kg07299';

  @Input()
  host = 'localhost';

  private term: any;

  private prefix = `[${this.user}@${this.host}]$ `;

  private command = [];

  input = '';

  currentOffset = 0;

  histIndex: number;

  histCommandList: string[] = [];

  private subscription: Subscription;
  @ViewChild('terminal', { static: true })
  private elementRef: ElementRef;

  ngOnInit(): void {
    this.subscription = this.rxStompService.watch(RESPONSE_CONSOLE)
      .subscribe(msg => {
        const response = JSON.parse(msg?.body)?.payload as SessionResponse;
        const message = response?.error ?? response?.payload;
        if (message) {
          this.term.writeln(message);
        }
      });
  }


  prompt(): void {
    this.term.write(this.prefix);
  }

  getText(): string {
    return this.command.join('');
  }

  handleInput(): void {
    this.term.write('\r\n');
    if (this.input.trim()) {
      // History Commands
      if (this.histCommandList[this.histCommandList.length - 1] !== this.input) {
        this.histCommandList.push(this.input);
        this.histIndex = this.histCommandList.length;
      }
      const command = this.input.trim().split(' ');
      // Place Holder
      switch (command[0]) {
        case 'help':
          this.term.writeln('\x1b[40;33;1m\nthis is a web terminal demo based on xterm!\x1b[0m\n此demo模拟shell上下左右和退格键效果\n');
          break;
        default:
          this.term.writeln(this.input);
          break;
      }
    }
    this.term.prompt();
  }

  constructor(private rxStompService: RxStompService) { }

  ngAfterViewInit(): void {
    this.term = new Terminal({
      cursorBlink: true,
      rows: 12,
      cols: 200,
      fontSize: 12,
      scrollback: 80,
      convertEol: true,
      fontFamily: 'Consolas',
      fastScrollModifier: 'ctrl',
      theme: {
        foreground: '#cccccc',
        background: '#1E1E1E',
      }
    } as ITerminalOptions);

    this.term.open(this.elementRef.nativeElement);

    this.term.loadAddon(new FitAddon());
    this.term.loadAddon(new WebLinksAddon());
    this.term.focus();

    this.term.writeln('Welcome to Stream SQL Playground');
    this.term.writeln('');

    this.term._initialized = true;

    this.term.onData((data) => {
      this.command.push(data);
    });

    this.term.prompt = () => {
      this.term.write(this.prefix);
    };


    this.term.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
      const key = e.key;
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      const threshold = this.prefix.length;
      // total offset = input + prefix
      const fixation = this.input.length + threshold;
      // x offset
      const offset = this.term._core.buffer.x;
      this.currentOffset = fixation;
      // Disable Home、PgUp、PgDn、Ins、Del
      if ([36, 33, 34, 45, 46].indexOf(ev.keyCode) !== -1) {
        return;
      }

      switch (ev.keyCode) {
        // Enter
        case 13:
          this.handleInput();
          this.input = '';
          break;
        // Backspace
        case 8:
          if (offset > threshold) {
            this.term._core.buffer.x = offset - 1;
            this.term.write('\x1b[?K' + this.input.slice(offset - threshold));
            // Keep the cursor
            const cursorData = this.bulidData(fixation - offset, '\x1b[D');
            this.term.write(cursorData);
            this.input = `${this.input.slice(0, offset - threshold - 1)}${this.input.slice(offset - threshold)}`;
          }
          break;
        case 35:
          const cursor = this.bulidData(fixation - offset, '\x1b[C');
          this.term.write(cursor);
          break;
        // 方向盘上键
        case 38:
          if (this.histCommandList[this.histIndex - 1]) {
            // 将光标重置到末端
            this.term._core.buffer.x = fixation;
            // tslint:disable-next-line: one-variable-per-declaration
            let b1 = '', b2 = '', b3 = '';
            // 构造退格(模拟替换效果) \b \b标识退一格; \b\b  \b\b表示退两格...
            for (let i = 0; i < this.input.length; i++) {
              b1 = b1 + '\b';
              b2 = b2 + ' ';
              b3 = b3 + '\b';
            }
            this.term.write(b1 + b2 + b3);
            this.input = this.histCommandList[this.histIndex - 1];
            this.term.write(this.histCommandList[this.histIndex - 1]);
            this.histIndex--;
          }
          break;
        // 方向盘下键
        case 40:
          if (this.histCommandList[this.histIndex + 1]) {
            // 将光标重置到末端
            this.term._core.buffer.x = fixation;
            let b1 = '', b2 = '', b3 = '';
            // 构造退格(模拟替换效果) \b \b标识退一格; \b\b  \b\b表示退两格...
            for (let i = 0; i < this.histCommandList[this.histIndex].length; i++) {
              b1 = b1 + '\b';
              b2 = b2 + ' ';
              b3 = b3 + '\b';
            }
            this.input = this.histCommandList[this.histIndex + 1];
            this.term.write(b1 + b2 + b3);
            this.term.write(this.histCommandList[this.histIndex + 1]);
            this.histIndex++;
          }
          break;
        // 方向盘左键
        case 37:
          if (offset > threshold) {
            this.term.write(key)
          }
          break;
        // 方向盘右键
        case 39:
          if (offset < fixation) {
            this.term.write(key)
          }
          break;
        default:
          if (printable) {
            // 限制输入最大长度 防止换行bug
            if (fixation >= this.term.cols) {
              return;
            }

            // 不在末尾插入时 要拼接
            if (offset < fixation) {
              this.term.write('\x1b[?K' + `${key}${this.input.slice(offset - threshold)}`);
              const cursorD = this.bulidData(fixation - offset, '\x1b[D');
              this.term.write(cursorD);
              this.input = `${this.input.slice(0, offset - threshold)}${key}${this.input.slice(offset - threshold)}`;
            } else {
              this.term.write(key);
              this.input += key;
            }
            this.histIndex = this.histCommandList.length;
          }
          break;
      }
    });

    this.term.fit();
  }


  bulidData(length: number, subString: string): string {
    let cursor = '';
    for (let i = 0; i < length; i++) {
      cursor += subString;
    }
    return cursor;
  }

  ngOnDestroy(): void {
    this.term.dispose();
    this.subscription?.unsubscribe();
  }

  CloseTerminal(): void {
    this.toggleTerminal.emit();
  }

  ClearAll(): void {
    this.term.clear();
  }
}
