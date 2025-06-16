# Simple FB Group Chat Bot

এটি একটি সহজ Facebook গ্রুপ চ্যাট বট যা কিছু ট্রিগার মেসেজ পেলে `responses.json` থেকে রিপ্লাই করবে।

---

## প্রয়োজনীয়তা

- Facebook একাউন্ট  
- `fbstate.json` (তোমার Facebook কুকিজ সংরক্ষিত JSON ফাইল)  
- GitHub রিপোজিটরি এই কোড নিয়ে

---

## সেটআপ স্টেপস

1. **Generate `fbstate.json`**:  
   ব্রাউজার থেকে `c_user`, `xs`, `datr` কুকিজ এক্সপোর্ট করে JSON ফাইল তৈরি করো।

2. **GitHub-এ নতুন রিপো তৈরি করো**  
3. **এই ফাইলগুলো আপলোড করো**:  
   - `bot.py`  
   - `responses.json`  
   - `requirements.txt`  
   - `.github/workflows/bot.yml`  
   - `README.md`

4. **Secrets এ যোগ করো**:  
   - Settings → Secrets → New repository secret  
   - Name: `FBSTATE_JSON`  
   - Value: তোমার `fbstate.json` ফাইলের সম্পূর্ণ JSON কপি-পেস্ট করো

5. **Run the bot**:  
   - Actions → Run workflow (বা কোড পুশ করলে স্বয়ংক্রিয় চালু হবে)

---

## সতর্কতা

- এটি আনঅফিসিয়াল পদ্ধতি, ফেসবুক লগিন চ্যালেঞ্জ আসতে পারে।  
- নিয়মিত মনিটর করো, ঝুঁকি বুঝে ব্যবহার করো।

---

## সাহায্য লাগলে

মোডিফিকেশন বা হোস্টিং নিয়ে সাহায্য চাইলে জানিও।
