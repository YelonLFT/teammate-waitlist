# Project Overview

You are building a Health Evaluation Platform, where users get evaluation and suggestions based on their body condition.

You will be using NextJS, shadcn, tailwind, Lucid icon

# Core Functionalities

1. Use LLM(deepseek/deepseek-chat-v3-0324:free) to analyse user input which is in JSON style containing his/her body condition. Evaluate the current condition and generate proper suggestion in JSON.

# Docs
## Documentation of how to use deepseek api
CODE EXAMPLE:
'''
import OpenAI from "openai";

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: '<DeepSeek API Key>'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
}

main();
'''

## 
## Documentation of how to use deepseek JSON Output
CODE EXAMPLE
'''
import json
from openai import OpenAI

client = OpenAI(
    api_key="<your api key>",
    base_url="https://api.deepseek.com",
)

system_prompt = """
The user will provide some exam text. Please parse the "question" and "answer" and output them in JSON format. 

EXAMPLE INPUT: 
Which is the highest mountain in the world? Mount Everest.

EXAMPLE JSON OUTPUT:
{
    "question": "Which is the highest mountain in the world?",
    "answer": "Mount Everest"
}
"""

user_prompt = "Which is the longest river in the world? The Nile River."

messages = [{"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}]

response = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages,
    response_format={
        'type': 'json_object'
    }
)

print(json.loads(response.choices[0].message.content))
'''


# Current File Structure
▼ TEAMMATE
  ├─ ▼ demo
  ├─ ▼ app
  │  ├─ favicon.ico         U
  │  ├─ globals.css         U
  │  ├─ layout.tsx          U
  │  └─ page.tsx            U
  ├─ ► node_modules
  ├─ ► public
  ├─ ▼ requirements
  ├─ instructions.md        U
  ├─ .gitignore             U
  ├─ next-env.d.ts          U
  ├─ next.config.ts         U
  ├─ package-lock.json      U
  ├─ package.json           U
  ├─ postcss.config.mjs     U
  ├─ README.md              U
  ├─ tsconfig.json          U
  └─ README.md