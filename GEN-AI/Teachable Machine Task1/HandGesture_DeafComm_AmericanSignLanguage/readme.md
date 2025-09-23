# HandGesture_DeafComm_AmericanSignLanguage

**Project Link / Demo:** [Open Model in Browser](https://teachablemachine.withgoogle.com/models/PykDykkti/)

---
## Project Description:

HandGesture_DeafComm is a real-time hand gesture recognition system that detects American Sign Language (ASL) alphabets (A–Z) and translates them into English letters. Using AI-powered image classification via Teachable Machine, the system allows deaf and hearing-impaired individuals to communicate words and sentences using simple hand gestures.
By capturing 26 hand gestures and training a model with 30–40 images per letter, the system provides real-time recognition through a webcam, making it an effective assistive and educational tool. This project not only bridges the communication gap between deaf and hearing people but also serves as a foundation for more advanced ASL translation applications, such as full sentence recognition or voice output.

## Key Highlights:

Recognizes all ASL alphabets.

Converts gestures into text letters, forming English words.

Real-time detection using a webcam and TensorFlow.js.

Enhances accessibility, education, and communication for the deaf community.

## Short Summary of Process and Results

1. **Dataset Creation:**  
   - 26 classes representing each ASL letter.  
   - 30–40 images per class captured via webcam.  
   
2. **Model Training:**  
   - Uploaded images to Teachable Machine.  
   - Trained the model using the built-in image classification workflow.  

3. **Testing & Evaluation:**  
   - Tested with new hand gestures not used in training.  
   - Observed **predicted labels** for each gesture.  
   - **Accuracy:** Approximately **75%**, with correct predictions for most gestures and some minor misclassifications.  

---  
## Why This Project Is Unique & Useful

- **Inclusive Communication:** Translates gestures into readable letters to spell words and sentences in real-time.  
- **Interactive Learning Tool:** Great for students and beginners to learn ASL alphabets in a fun, tech-driven way.  
- **Accessibility & Empowerment:** Bridges the communication gap, making daily interactions easier for the deaf community.  
- **AI-Assisted Convenience:** Uses webcam and TensorFlow.js for instant feedback.  
- **Scalable & Extensible:** Can be expanded for full ASL word recognition, voice output, or mobile apps.  
- **Personal Touch:** Each class was carefully captured with different hand positions to ensure diverse training data.  

---

## What It Does

- Recognizes **26 hand gestures** corresponding to ASL letters.  
- Converts gestures into **text**, allowing users to form **words and sentences**.  
- Works in **real-time** using a webcam.  
- Provides an accessible interface for **communication and education**.  

---

## How It Is Done

- **Image Dataset Creation:** 26 classes representing each ASL letter, with 30–40 images per class.  
- **Model Training:** Trained on Teachable Machine using uploaded hand gesture images for each class.  
- **Machine Learning:** Uses **image classification** techniques to identify hand positions.  
- **Deployment:** Exported as a **TensorFlow.js model** for real-time browser use.  

---

## Real-World Uses & Applications

- **Communication Aid:** Converts hand gestures into readable text for daily conversations.  
- **Educational Tool:** Teaches ASL alphabets interactively for students and beginners.  
- **Accessibility:** Bridges the communication gap between deaf and hearing individuals.  
- **Assistive Technology:** Can be integrated into web apps, video calls, or public kiosks.  
- **Foundational Platform:** Forms the basis for future ASL word or sentence recognition systems.  
