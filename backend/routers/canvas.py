from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from CFCreators import CFCreator


router = APIRouter(prefix="/canvas")

@router.post('/deploy')
def deploy_initiate(canvas: dict):
    print(canvas)
    # CFCreator.createGeneration(canvas)


    return canvas