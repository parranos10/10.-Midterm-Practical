from sqlmodel import select
from fastapi import APIRouter, HTTPException, status
from db import SessionDep
from models import Video, VideoCreate
import random

router = APIRouter(prefix="/videos", tags=["Videos"])

@router.get("/")
def get_videos(session: SessionDep):
    return session.exec(select(Video)).all()

@router.get("/{video_id}")
def get_video_by_id(video_id: int, session: SessionDep):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")
    return video

@router.get("/{video_id}/recomendaciones")
def get_recomendaciones(video_id: int, session: SessionDep):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    query = select(Video).where(Video.categoria == video.categoria).where(Video.id != video_id)
    resultados = session.exec(query).all()
    return random.sample(resultados, min(len(resultados), 10))

@router.post("/")
def create_video(video_data: VideoCreate, session: SessionDep):
    video = Video.model_validate(video_data.model_dump())
    session.add(video)
    session.commit()
    session.refresh(video)
    return video