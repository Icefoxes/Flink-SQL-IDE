package com.spyduck.websocket.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.eclipse.jgit.api.CloneCommand;
import org.eclipse.jgit.api.CreateBranchCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;

@Service
@Slf4j
public class VersionService {

    private String newBranchName;

    public String getNewBranchName() {
        return null;
    }

    public boolean cloneBranch() throws GitAPIException, IOException {
        File file = new File(getProjectPath());
        FileRepositoryBuilder builder = new FileRepositoryBuilder();
        Repository repository = builder.setGitDir(file).readEnvironment().findGitDir().build();
        Git git = new Git(repository);
        CloneCommand clone = git.cloneRepository();
        clone.setBare(false);
        clone.setCloneAllBranches(true);
        clone.setDirectory(file).setURI(getProjectUri());
        clone.call();
        log.info("clone branch successfully");
        return true;
    }

    private String getProjectUri() {
        return null;
    }

    public boolean createBranch() throws IOException, GitAPIException {
        Git git = Git.open(new File(getProjectPath()));
        CreateBranchCommand createBranchCommand = git.branchCreate();
        createBranchCommand.setName(getNewBranchName());
        createBranchCommand.setForce(true);
        createBranchCommand.call();
        git.checkout().setName(getNewBranchName()).call();
        log.info("create & checkout {} successfully", getNewBranchName());
        return true;
    }

    public boolean commitBranch(String commitMessage) throws IOException, GitAPIException {
        Git git = Git.open(new File(getProjectPath()));
        git.add().addFilepattern(".").call();
        git.commit().setMessage(commitMessage).call();
        log.info("commit successfully");
        return true;
    }

    public boolean pushBranch() throws IOException, GitAPIException {
        Git git = Git.open(new File(getProjectPath()));
        git.push().setRemote("origin")
                .add(getNewBranchName())

                .call();
        log.info("push successfully");
        return true;
    }

    public String getProjectPath() {
        String tempPath = System.getProperty("java.io.tmpdir");
        return Paths.get(tempPath, getProjectName()).toString();
    }

    private String getProjectName() {

        return null;
    }

    public boolean deleteProjectFile() {
        File file = new File(getProjectPath());
        if (file.exists()) {
            try {
                FileUtils.deleteDirectory(file);
            } catch (Exception e) {
                log.error(e.getMessage(), e);
            }

        }
        log.info("delete {} successfully", getProjectPath());
        return true;
    }

}
