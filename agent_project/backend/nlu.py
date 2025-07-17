import re
from typing import Dict, Any

def parse_intent(user_input: str) -> Dict[str, Any]:
    """
    Extracts intent and relevant slots from user input.
    Returns a dict with 'intent', 'slots', and 'clarification' (if needed).
    """
    # Example intents and slot patterns
    patterns = [
        {
            'intent': 'send_email',
            'regex': r'send (an )?email to (?P<recipient>\w+)( about (?P<subject>[^.]+))?( for (?P<purpose>[^.]+))?( on (?P<date>[^.]+))?',
            'slots': ['recipient', 'subject', 'purpose', 'date']
        },
        # Add more intent patterns here
    ]
    
    for pat in patterns:
        match = re.search(pat['regex'], user_input, re.IGNORECASE)
        if match:
            slots = {slot: match.group(slot) for slot in pat['slots'] if match.group(slot)}
            missing = [slot for slot in pat['slots'] if slot not in slots]
            clarification = None
            if missing:
                clarification = f"Could you specify the {', '.join(missing)}?"
            return {
                'intent': pat['intent'],
                'slots': slots,
                'clarification': clarification
            }
    # Fallback: try LLM (OpenAI/Gemini/GPT) if available
    # Example placeholder:
    # response = call_llm(user_input)
    # if response:
    #     return response
    return {
        'intent': None,
        'slots': {},
        'clarification': 'Sorry, I could not understand your intent. Could you rephrase?'
    } 