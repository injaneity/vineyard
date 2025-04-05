from pydantic import BaseModel, HttpUrl
from typing import Optional

class OnboardDTO(BaseModel):
    username: str 
    shopee_url: Optional[str] = ""  
    lazada_url: Optional[str] = ""
    carousell_url: Optional[str] = ""

class ScrapeDTO(BaseModel):
    username: str 
    product: str

class DashboardDTO(BaseModel):
    username: str