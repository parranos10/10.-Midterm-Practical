from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional


class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    texto: str
    autor: str
    
   
    video_id: Optional[int] = Field(default=None, foreign_key="video.id")
    video: Optional["Video"] = Relationship(back_populates="comentarios")


class Video(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    titulo: str
    canal: str
    vistas: str
    fecha: str
    categoria: str
    video_url: str      # URL de AWS S3 del archivo .mp4
    miniatura_url: str  # URL de AWS S3 de la imagen
    
    
    comentarios: List[Comment] = Relationship(back_populates="video")

class VideoCreate(SQLModel):
    titulo: str
    canal: str
    vistas: str
    fecha: str
    categoria: str
    video_url: str
    miniatura_url: str

class CommentCreate(SQLModel):
    texto: str
    autor: str
    video_id: int