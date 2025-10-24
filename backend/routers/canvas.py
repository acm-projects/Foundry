from fastapi import APIRouter, HTTPException,Header
from typing import Optional
from pydantic import BaseModel
from CFCreators import CFCreator
import httpx

router = APIRouter(prefix="/canvas")

@router.post('/deploy')
def deploy_initiate(canvas: dict):
    print(canvas)
    # CFCreator.createGeneration(canvas)


    return canvas



@router.get('/')
async def get_repos(authorization: Optional[str] = Header(None)): 

    if not authorization: 
        raise HTTPException(status_code=401, detail="Authorization header missing")
    


    token = authorization.split(" ")[1]

    async with httpx.AsyncClient() as client:  
        response = await client.get(f"https://api.github.com/users/{token}/repos")
        

        repos = response.json()

        simplified = [
        {
            "name": repo["name"],
            "html_url": repo["html_url"],
            "zip_url": f"https://github.com/{token}/{repo['name']}/archive/refs/heads/main.zip"
        }
        for repo in repos
    ]
        return simplified
        


       
     


