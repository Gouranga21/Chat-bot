import json
from fbchat import Client
from fbchat.models import *

class SimpleBot(Client):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        with open("responses.json", "r", encoding="utf-8") as f:
            self.responses = json.load(f)

    def onMessage(self, author_id, message_object, thread_id, thread_type, **kwargs):
        if author_id != self.uid and thread_type == ThreadType.GROUP:
            msg = message_object.text or ""
            msg_lower = msg.lower()
            for trigger, reply in self.responses.items():
                if trigger in msg_lower:
                    self.send(
                        Message(text=reply),
                        thread_id=thread_id,
                        thread_type=thread_type
                    )
                    break

if __name__ == "__main__":
    client = SimpleBot(login_cookies="fbstate.json")
    client.listen()
