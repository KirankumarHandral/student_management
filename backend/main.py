
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import Student
from schemas import StudentCreate, StudentResponse
from typing import List


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(title="Student Management API")


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development only
    allow_methods=["*"],
    allow_headers=["*"],
)


# GET: Fetch all students
@app.get("/students", response_model=List[StudentResponse])
def get_students(db: Session = Depends(get_db)):

    return db.query(Student).all()


# GET: Fetch student by ID
@app.get("/students/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return student


# POST: Add student
@app.post("/students", response_model=StudentResponse, status_code=201)
def create_student(data: StudentCreate, db: Session = Depends(get_db)):

    existing_student = db.query(Student).filter(
        Student.email == data.email
    ).first()

    if existing_student:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    new_student = Student(
        name=data.name,
        email=data.email,
        mobile=data.mobile,
        course=data.course
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


# PUT: Update student
@app.put("/students/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int,
    data: StudentCreate,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    existing_email = db.query(Student).filter(
        Student.email == data.email,
        Student.id != student_id
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    student.name = data.name
    student.email = data.email
    student.mobile = data.mobile
    student.course = data.course

    db.commit()
    db.refresh(student)

    return student


# DELETE: Delete student
@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    db.delete(student)
    db.commit()

    return {"message": "Student deleted successfully"}
