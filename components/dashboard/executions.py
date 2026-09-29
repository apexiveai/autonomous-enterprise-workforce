from uuid import uuid4

from fastapi import APIRouter, HTTPException

from pydantic import BaseModel

from app.workflows.runner import run_workflow

router = APIRouter(

    prefix="/executions",

    tags=["Executions"],

)

class ExecutionRequest(BaseModel):

    goal: str

@router.post("")

async def create_execution(request: ExecutionRequest):

    if not request.goal.strip():

        raise HTTPException(

            status_code=400,

            detail="Goal is required.",

        )

    run_id = str(uuid4())

    thread_id = str(uuid4())

    result = await run_workflow(

        goal=request.goal,

        thread_id=thread_id,

        run_id=run_id,

    )

    return {

        "run_id": run_id,

        "thread_id": thread_id,

        **result,

    }

@router.get("/{run_id}")

async def get_execution(run_id: str):

    """

    Temporary execution lookup endpoint.

    Persistent WorkflowRun lookup will be added next.

    """

    return {

        "run_id": run_id,

        "status": "running",

        "message": "Execution status endpoint is ready.",

    }