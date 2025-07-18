import os
from typing import Dict

try:
    import openai
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    if OPENAI_API_KEY:
        openai.api_key = OPENAI_API_KEY
except ImportError:
    openai = None
    OPENAI_API_KEY = None

def generate_email_content(context: Dict) -> Dict[str, str]:
    """
    Generate a professional subject and well-formatted email body based on context.
    Uses OpenAI's GPT API if available, otherwise falls back to a template.
    Context keys: purpose, recipient, dates, tone, etc.
    Returns: { 'subject': ..., 'body': ... }
    """
    purpose = context.get('purpose', 'general')
    recipient = context.get('recipient', 'Recipient')
    dates = context.get('dates', '')
    tone = context.get('tone', 'formal')

    prompt = f"""
    Write a professional email for the following context:
    Purpose: {purpose}
    Recipient: {recipient}
    Dates: {dates}
    Tone: {tone}
    Provide a subject line and a well-formatted email body.
    """

    if openai and OPENAI_API_KEY:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert email writer."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300
        )
        content = response.choices[0].message.content
        # Try to split subject and body
        lines = content.splitlines()
        subject = next((l.replace('Subject:', '').strip() for l in lines if l.lower().startswith('subject:')), None)
        body = '\n'.join(l for l in lines if not l.lower().startswith('subject:')).strip()
        return {"subject": subject or "(No Subject)", "body": body}
    else:
        # Fallback template
        subject = f"{purpose.title()} Request"
        body = f"Dear {recipient},\n\nI am writing to you regarding {purpose}. {('This concerns the following dates: ' + dates) if dates else ''}\n\nBest regards,\n[Your Name]"
        if tone == 'friendly':
            body = body.replace('Dear', 'Hi').replace('Best regards', 'Thanks')
        return {"subject": subject, "body": body} 