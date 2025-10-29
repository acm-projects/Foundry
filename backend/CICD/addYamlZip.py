import zipfile
import tempfile 
import shutil
import os

#the templates only work if the repo has a frontend or backend folder 
# second edit : also if the user has a fastapi target file (requirements.txt, etc.) - enaya

fastapi_buildspec_template="""
version: 0.2
phases:
  install:
    runtime-versions:
      python: 3.11
    commands:
      - pip install -r requirements.txt
  build:
    commands:
      - echo "Starting FastAPI build"
      - zip -r app.zip .
artifacts:
  files:
    - '**/*'
"""

fastapi_appspec_template="""
version: 0.0
os: linux
files:
  - source: /
    destination: /home/ec2-user/app
hooks:
  BeforeInstall:
    - location: scripts/install.sh
      timeout: 300
  ApplicationStart:
    - location: scripts/start.sh
      timeout: 300
  ApplicationStop:
    - location: scripts/stop.sh
      timeout: 300
"""

dummyTemplate = """
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - cd $CODEBUILD_SRC_DIR/*/frontend
      - npm ci
      
  build:
    commands:
      - npm run build
      
  post_build:
    commands:
      - echo "Build complete"
      - du -sh .next/
      - du -sh node_modules/

artifacts:
  files:
    - '**/*'
  exclude-paths:
    - '*/frontend/.next/cache/**/*'
    - '*/frontend/node_modules/.cache/**/*'
"""


appspecTemplate = """
version: 0.0
os: linux

files:
  - source: /
    destination: /home/ec2-user/app

permissions:
  - object: /home/ec2-user/app
    pattern: "*.sh"
    owner: ec2-user
    group: ec2-user
    mode: 755

hooks:
  BeforeInstall: 
    - location: scripts/stop.sh
      timeout: 300

      


  
  AfterInstall: 
    - location: scripts/install.sh
      timeout: 300
      runas: root
    
 
      
  ApplicationStart:
    - location: scripts/start.sh
      timeout: 300
   
"""

def addBuildSpec(zip_path,buildSpec,overWrite=True): 

    with zipfile.ZipFile(zip_path, 'r') as zin:  #open zip file and read it 
        names = zin.namelist() #returns a list of file paths 

        if not names: 
           
            raise ValueError("Zip file is empty.")
            return
        
        rootFolder = names[0]

        root_prefix = rootFolder.split("/")[0] + "/"

        target_path = "buildspec.yml"
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

        target_path = "appspec.yml"
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
            
            

    

      
    
