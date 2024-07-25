from langchain.agents import create_sql_agent
from langchain.agents.agent_toolkits import SQLDatabaseToolkit
from langchain.sql_database import SQLDatabase
from langchain.chat_models import ChatOpenAI
from langchain.agents.agent_types import AgentType
from dotenv import load_dotenv



llm = ChatOpenAI(model='gpt-3.5-turbo',openai_api_key=KEY)
toolkit=SQLDatabaseToolkit(db=database, llm=llm)


agent_executor = create_sql_agent(
    llm=llm,
    toolkit=toolkit,
    agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    prefix='A.I to interact with my MsSQL database'
)