from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/canvas")

@router.post('/deploy')
def deploy_initiate(canvas: dict):
    print(canvas)
    return canvas