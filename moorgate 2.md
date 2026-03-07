I have updated the github with the changes. These are the changes I am proposing. Instead of using google sheets. Just use supabase to have the table with the leads on the frontend instead of configuring it on the dashboard in vapi. We can have the table in the frontend of the app. The goal is to make it easier to use for the people at moorgate finance who are non tech

The voice agent needs to use a gemini model instead of an OpenAI one. 

This the documentation for the outbound calling. The settings for these should be under the rules engine too so it can allow the voice agent to do multiple calls without configuring via dashboard on the vapi website. Preferably through the vapi SDK. Here are the relevant document pages for that 
There are relevant docs given by vapi on these pages which explain how to configure outbound calls and call forwarding. I will paste the links below. Go through all of them carefully
https://docs.vapi.ai/calls/outbound-calling
https://docs.vapi.ai/calls/websocket-transport
https://docs.vapi.ai/calls/customer-join-timeout
https://docs.vapi.ai/calls/voicemail-detection
https://docs.vapi.ai/call-forwarding
https://docs.vapi.ai/calls/assistant-based-warm-transfer
https://docs.vapi.ai/calls/call-handling-with-vapi-and-twilio
https://docs.vapi.ai/phone-calling/in-call-control/transfer-calls/debug-forwarding-drops
https://docs.vapi.ai/calls/call-concurrency
https://docs.vapi.ai/calls/call-queue-management
https://docs.vapi.ai/calls/call-ended-reason

### Components to be added to the sidebar

#### Leads
It is a table which has the customer name,number and prompt from the prompt library. The customer can even attach their existing csv file and it will automatically copy the leads onto the table in the interface which can later be edited. The prompts can be selected using a dropdown list in the table. It should have good error handling to deal with the csv files as well

#### Prompts
Contains a textbox to type in the prompts and can be saved by the user under a name say Prompt 1,2 etc. On the side of the textbox will be the prompt library which shows all the saved prompts which can be selected, edited or deleted as per the user preference. These prompts will live in the backend in supabase

#### Rules Engine
This is where the user can visually edit the rules of the outbound agent. It dictates when to forward the calls to a live agent. All of the rules can be edited by the user in this interface. Example is given below in the extras section

I have attached the codes for the above three components in the code_components.md file 
### Components to be modified in the sidebar
All buttons in the call logs component must be working and connected to supabase backend

### Components to be commented out
The policies, claim, chat support, payments components can be commented out and not deleted for the time being. 
The AI insights button on the dashboard component can be removed


### API stuff to be configured
There needs to be a twillo number, Vapi API keys. This can be configured in the backend


### Responsiveness 
Should allow the app to work on mobile phone as well.

### Backend Architecture

Supabase (Leads Table)
      ↓ (trigger)
Backend / Edge Function
      ↓
Vapi (Call Execution)
      ↓
Webhook Events(edge function)
      ↓
Rules Engine (Evaluate Outcome)
      ↓
Actions:
  - Mark Hot Lead
  - Schedule Callback
  - Transfer to Human
      ↓
Supabase (Calls + Lead Status)

Correct Data Model
Leads
id
name
phone
category
status: new | contacted | hot | callback_scheduled
prompt_id

Prompts
id
name
script
category

Rules
id
condition_json   // {"intent": "ready_now"}
action           // "transfer_to_agent"
target           // "+94xxxx"

Calls
id
lead_id
vapi_call_id
intent_detected
outcome
transcript
recording_url

Correct Execution Flow (What You Want)
Lead inserted
onLeadCreated(lead) {
  const prompt = selectPrompt(lead)
  const rules = getActiveRules()
  queueCall({ lead, prompt, rules })
}

Call outcome webhook
onVapiWebhook(payload) {
  const intent = payload.intent
  const action = rulesEngine.resolve(intent)

  if (action === "transfer") transferCall()
  if (action === "callback") scheduleCallback()
  if (action === "hot") markHotLead()
}




### Extras
With Vapi, a “transfer to human” is near-instant, but it’s not literally zero-latency. In practice, when your AI detects “ready now” and you trigger a transfer, here’s what happens:

What “instant transfer” actually looks like

AI hears intent (“Yeah, connect me now”)

Vapi sends a webhook / tool event to your backend (or you’ve preconfigured the transfer rule)

Your backend responds with the target number / SIP endpoint

Vapi initiates the transfer to the human agent

Caller is bridged to the human

This usually takes ~300ms to ~2 seconds end-to-end depending on:

your webhook response time

network latency

the carrier / SIP provider picking up

To the caller, it feels instant:

“Great, connecting you now…” → short pause → human picks up

No awkward “hang up and we’ll call you back” flow unless you design it that way.

How to Make It Feel Truly Instant (UX tricks that matter)

You can mask the tiny delay with the AI:

“Perfect, I’m connecting you to a specialist right now. One moment…”

This buys you ~1–2 seconds without feeling broken.

Two Transfer Modes You Can Choose
🔁 1. Live Call Transfer (Warm Transfer)

Caller is bridged in the same call session:

Customer ── Vapi ── Human Agent


Best for:

sales

hot leads

urgent support

Feels like a real call center transfer.

📞 2. Callback Transfer (Cold Transfer)

If no human answers:

AI schedules callback

updates lead status

books appointment

This is your fallback when:

no agents available

after hours

busy lines


