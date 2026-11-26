from pydantic import BaseModel, EmailStr, Field


class StudentCreate(BaseModel):

    name: str = Field(min_length=1, max_length=100)

    email: EmailStr

    mobile: str = Field(pattern=r"^\d{10}$")

    course: str = Field(min_length=1, max_length=100)


class StudentResponse(StudentCreate):

    id: int

    class Config:
        from_attributes = True
