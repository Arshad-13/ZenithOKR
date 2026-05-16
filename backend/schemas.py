from pydantic import BaseModel, Field
from typing import Optional, List
from models import UoMEnum, StatusEnum, QuarterEnum

class GoalBase(BaseModel):
    thrust_area: str
    title:str
    description: Optional[str] = None
    uom: UoMEnum
    target: float
    weightage: float = Field(..., ge=10, le=100, description="Min. 10, Max. 100")
    
class GoalCreate(GoalBase):
    owner_id: str
    
class GoalResponse(GoalBase):
    id: int
    owner_id: str
    is_locked: bool
    
    class Config:
        from_attributes = True

class UserBasic(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True

class TeamGoalResponse(GoalResponse):
    owner: UserBasic  

class GoalUpdate(BaseModel):
    target: Optional[float] = None
    weightage: Optional[float] = None
    is_locked: Optional[bool] = None
    manager_id: str 
    
class CheckInBase(BaseModel):
    quarter: QuarterEnum
    actual_achievement: float
    status: StatusEnum

class CheckInCreate(CheckInBase):
    goal_id: int

class CheckInReview(BaseModel):
    manager_comment: str

class CheckInResponse(CheckInBase):
    id: int
    goal_id: int
    manager_comment: Optional[str] = None
    progress_score: float  # We will calculate this on the fly before sending to frontend

    class Config:
        from_attributes = True