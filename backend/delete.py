from database import SessionLocal
from database import DBUserProduct, DBUserActivity, DBUser

from sqlalchemy import create_engine, Column, String, Float, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import uuid
from datetime import datetime
from zoneinfo import ZoneInfo

# Create SQLite database engine
SQLALCHEMY_DATABASE_URL = "sqlite:///./vineyard.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Create declarative base
Base = declarative_base()

# Create database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
try:
    # Delete in correct order (child tables first)
    db.query(DBUserActivity).delete()
    db.query(DBUserProduct).delete()
    db.query(DBUser).delete()
    db.commit()
    print("All data has been deleted!")
except Exception as e:
    db.rollback()
    print(f"An error occurred: {e}")
finally:
    db.close()