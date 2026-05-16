import uuid
import sys
import os

# Add the backend directory to sys.path so we can import from database and models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
from models import User, RoleEnum

def seed_users():
    db = SessionLocal()
    try:
        # Create an admin
        admin_email = "admin@example.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(id=str(uuid.uuid4()), name="System Admin", email=admin_email, role=RoleEnum.ADMIN)
            db.add(admin)

        # Create a manager
        manager_email = "manager@example.com"
        manager = db.query(User).filter(User.email == manager_email).first()
        if not manager:
            manager = User(id=str(uuid.uuid4()), name="Engineering Manager", email=manager_email, role=RoleEnum.MANAGER)
            db.add(manager)

        db.commit()

        # Create an employee
        employee_email = "employee@example.com"
        employee = db.query(User).filter(User.email == employee_email).first()
        if not employee:
            # Need to get manager to assign manager_id
            manager = db.query(User).filter(User.email == manager_email).first()
            employee = User(
                id=str(uuid.uuid4()), 
                name="Software Engineer", 
                email=employee_email, 
                role=RoleEnum.EMPLOYEE,
                manager_id=manager.id if manager else None
            )
            db.add(employee)
            
        db.commit()
        print("Successfully seeded users (Admin, Manager, Employee).")
    except Exception as e:
        print(f"Error seeding users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()