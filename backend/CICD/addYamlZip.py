import zipfile
import tempfile 
import shutil
import os

#the templates only work if the repo has a frontend or backend folder 

#whoever sees this when I make a zip file it adds it locally so someone like fix it so it deletes after use
dummyTemplate = """version: 0.2

cache:
  paths:
    - '*/frontend/node_modules/**/*'
    - '*/frontend/.next/cache/**/*'

phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:

     
      - echo "Installing dependencies..."
      - cd $CODEBUILD_SRC_DIR
      - pwd && ls -la
      - cd */frontend
     
  
      - npm ci
  build:
    commands:
      - echo "Building frontend..."
      - npm run build 
  post_build:
    commands:
      - echo "complete build"

artifacts:

  files:
    - '**/*'

"""


appspecTemplate = """
version: 0.0
os: linux

files:
  - source: /
    destination: /home/ubuntu/my-next-app

permissions:
  - object: /home/ubuntu/my-next-app
    owner: ubuntu
    group: ubuntu
    mode: 755
    type:
      - directory
      - file

hooks:
  ApplicationStop:
    - location: scripts/stop_app.sh
      timeout: 60
      runas: ubuntu
      
  BeforeInstall:
    - location: scripts/cleanup.sh
      timeout: 60
      runas: ubuntu
      
  AfterInstall:
    - location: scripts/install_dependencies.sh
      timeout: 300
      runas: ubuntu
      
  ApplicationStart:
    - location: scripts/start_app.sh
      timeout: 60
      runas: ubuntu
      
  ValidateService:
    - location: scripts/validate.sh
      timeout: 60
      runas: ubuntu
"""

def addBuildSpec(zip_path,buildSpec,overWrite=True): 

    with zipfile.ZipFile(zip_path, 'r') as zin:  #open zip file and read it 
        names = zin.namelist() #returns a list of file paths 

        if not names: 
           
            raise ValueError("Zip file is empty.")
            return
        
        rootFolder = names[0]

        root_prefix = rootFolder.split("/")[0] + "/"

        target_path = root_prefix + "buildspec.yml"
        print("Target path for buildspec:", target_path)

        has_buildspec = target_path in names

   
        tmp_dir,tmp_zip_path = tempfile.mkstemp() #makes temporary empty file

        os.close(tmp_dir) #temp_dir is a file descriptor not needed so we close it
        try:
            with zipfile.ZipFile(tmp_zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zout:
                for item in names:
                    # Skip the old buildspec if we're overwriting
                    if overWrite and item == target_path:
                        continue
                    data = zin.read(item)
                    zout.writestr(item, data)

    
                zout.writestr(target_path, buildSpec)

            
            shutil.move(tmp_zip_path, zip_path)


            print("file path for yaml to send to aws",target_path)

       

            if has_buildspec and overWrite:
                print("Replaced existing buildspec.yml in ZIP.")
          
            else:
                print("Injected buildspec.yml into ZIP.")

                return target_path


               # print(names)
        finally:
           
            if os.path.exists(tmp_zip_path):
                try:
                    os.remove(tmp_zip_path)
                except OSError:
                    pass
def addAppSpec(zip_path,buildSpec,overWrite=True): 

    with zipfile.ZipFile(zip_path, 'r') as zin:  #open zip file and read it 
        names = zin.namelist() #returns a list of file paths 

        if not names: 
           
            raise ValueError("Zip file is empty.")
            return
        
        rootFolder = names[0]

        root_prefix = rootFolder.split("/")[0] + "/"

        target_path = root_prefix + "appspec.yml"
        print("Target path for appspec:", target_path)

        has_buildspec = target_path in names

   
        tmp_dir,tmp_zip_path = tempfile.mkstemp() #makes temporary empty file

        os.close(tmp_dir) #temp_dir is a file descriptor not needed so we close it
        try:
            with zipfile.ZipFile(tmp_zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zout:
                for item in names:
                    # Skip the old buildspec if we're overwriting
                    if overWrite and item == target_path:
                        continue
                    data = zin.read(item)
                    zout.writestr(item, data)

    
                zout.writestr(target_path, buildSpec)

            
            shutil.move(tmp_zip_path, zip_path)

            if has_buildspec and overWrite:
                print("Replaced existing buildspec.yml in ZIP.")
          
            else:
                print("Injected appSpec into ZIP.")
               # print(names)
        finally:
           
            if os.path.exists(tmp_zip_path):
                try:
                    os.remove(tmp_zip_path)
                except OSError:
                    pass
            
            

    

      
    
