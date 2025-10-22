import zipfile
import tempfile 
import shutil
import os
dummyTemplate = """version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - echo "Installing dependencies"
      - npm ci
  build:
    commands:
      - echo "Building Next.js app"
      - npm run build

artifacts:
  files:
    - '**/*'
  discard-paths: no
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

        has_buildspec = target_path in names

        if has_buildspec and not overWrite:
            print("Buildspec.yml already exists")
            return
        


        tmp_dir,tmp_zip_path = tempfile.mkstemp()

        os.close(tmp_dir) #left off here

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
                print("Injected buildspec.yml into ZIP.")
                print(names)
        finally:
           
            if os.path.exists(tmp_zip_path):
                try:
                    os.remove(tmp_zip_path)
                except OSError:
                    pass
            

    

      
    
