from pydantic import BaseModel, Field
from typing import Literal


class CameraAction(BaseModel):
    target: str = Field(..., description="The celestial body to focus on")
    action: Literal["focus", "zoom", "orbit", "reset"] = Field(default="focus", description="The camera action to perform")


class SimulatorResponse(BaseModel):
    camera_action: CameraAction
    chat_response: str = Field(..., description="Educational response to the user")
    session_id: str = Field(default="default", description="Session ID for memory tracking")