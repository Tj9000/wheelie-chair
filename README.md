# wheelie-chair
Smart wheel chair usint IOV, done as project by Final year BE CSE students, NIE Mysore,

#Instructions:
Have node, npm installed and configured in path.
		ubuntu users just do: sugo apt-get install nodejs npm
		windows users: install nodejs from website and configure environment variables (check if both node and npm are accessible)

Use 'npm install' to install required pacakges

use npm start to start express server --currently configures for front end UI

access from browser with localhost:8888 (or ip of the computer)






###################################################################################################
git cheatsheet:

(try a tutorial: https://try.github.io )
(additional: https://services.github.com/on-demand/downloads/github-git-cheat-sheet.pdf )

git clone <URL>		- to clone the repository (it also created new folder with the repo name)

git status			- shows statuf of files.. committed, changed, not trackes, etc.

git diff 			- displays the differences in the changed files

git add <FILENAME>	- adds file to be committed

git commit -m "your message" - commits added files with message (commit is local)

git commit -a -m "your message" - adds all files and commitsit with message

git push origin <BRANCH> - the committed state will be pushed to github repository (push is remote)
							pushes from origin(local) to specified branch
git push -u origin <BRANCH> - saves it for next
git push 					- performs push command saved earlier

git pull 					- (pulls from repo, adding any changes)


....................................................................................................
git branch [branch-name]	-	Creates a new branch
git checkout [branch-name]	-	Switches to the specified branch
								(use )

....................................................................................................

USING:
use remote branch: sprint1 (avoid master)

git branch (list all branch names)\

git checkout sprint1	- one time setup to change branch name

everytime do:
git status 	- to check status of current working set
git diff 	- use IF you want to check/verify changes
git add <FILES> - if you want to explictily add files to commit. use "git add ." to add all files
git commit -a -m "message"

git pull (to make sure you have updated other files)

git status

git push -u origin sprint1		- one time setup

git push 						- subsequent push
####################################################################################################
