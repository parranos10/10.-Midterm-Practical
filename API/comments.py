from sqlmodel import select
from fastapi import APIRouter
from db import SessionDep
from models import Comment, CommentCreate

router = APIRouter(prefix="/comments", tags=["Comentarios"])

@router.get("/video/{video_id}")
def get_comments_by_video(video_id: int, session: SessionDep):
    query = select(Comment).where(Comment.video_id == video_id)
    return session.exec(query).all()

@router.post("/")
def create_comment(comment_data: CommentCreate, session: SessionDep):
    comment = Comment.model_validate(comment_data.model_dump())
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment