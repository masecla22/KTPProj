import json
import sys
import tkinter as tk

# Initialize the window and global variables
window = tk.Tk()
user_answer_var = tk.StringVar()

window.geometry("1000x500")
window.configure(background='#9DD9F3')

# Set up grid layout
for i in range(3):
    window.columnconfigure(i, weight=1, minsize=200)
    window.rowconfigure(i, weight=1, minsize=100)
    for j in range(3):
        if i == 1 and j == 1:
            mainFrame = tk.Frame(master=window, height=400, width=300, background="white")
            mainFrame.grid(row=i, column=j)
            continue
        frame = tk.Frame(master=window)
        frame.grid(row=i, column=j)
        label = tk.Label(master=frame, text="", background='#9DD9F3')
        label.pack()

mainFrame.config(width=200, height=400, background='white')
layout_fix = tk.Label(master=mainFrame, background='white', width=200)


def reset(facts, filename):
    facts.clear()  # Clear the facts list
    with open(filename, "r") as file:
        data = json.load(file)
    data["Facts"] = facts
    update_file(data, filename)


# Clear previous widgets on the screen
def clear_frame():
    for widgets in mainFrame.winfo_children():
        widgets.destroy()


# Update text displayed in the main frame
def update_text_frame(txt):
    answer = tk.Label(master=mainFrame, text=txt, bg="white")
    answer.grid(row=3, padx=50, pady=20)


# Update title in the main frame
def update_title_frame(txt):
    title = tk.Label(master=mainFrame, text=txt, bg="white", font=("Arial", 16, "bold"))
    title.grid(row=2, padx=50, pady=20)


# Update the JSON file with current data
def update_file(data, filename):
    with open(filename, "w") as file:
        json.dump(data, file, indent=4)


# Read JSON data from file
def read_file(filename):
    with open(filename, "r") as file:
        data = json.load(file)
    return data


# Stop running if window is manually closed before reaching conclusion
def on_closing():
    user_answer_var.set('close')
    window.destroy()


# Continue to the first question
def cont():
    clear_frame()
    new_question(i=0)


# Welcome screen with a continue button
def welcome(data, filename):
    welcome_message = tk.Label(master=mainFrame, text="Welcome to the Learning Disability Diagnosis Tool!", bg='white')
    welcome_message.grid(row=0, padx=5, pady=20, sticky='w')
    continue_btn = tk.Button(master=mainFrame, text="Continue", command=lambda: execute_knowledge_base(data, filename))
    continue_btn.grid(row=1, padx=5, pady=5)


# Display a new question with yes/no buttons
def new_question(question):
    clear_frame()
    print(f"\n[TRACE] Displaying question: {question}")
    question_text = tk.Label(master=mainFrame, text=question, bg='white')
    question_text.grid(row=0, padx=5, pady=20, sticky='w')
    yes_btn = tk.Button(master=mainFrame, text="Yes", command=lambda: yes())
    yes_btn.grid(row=1, padx=5, pady=5)
    no_btn = tk.Button(master=mainFrame, text="No", command=lambda: no())
    no_btn.grid(row=2, padx=5, pady=5)


def yes():
    print("[TRACE] User answered: Yes")
    user_answer_var.set('yes')


def no():
    print("[TRACE] User answered: No")
    user_answer_var.set('no')


# Display disclaimer information
def disclaimer(rules, current_disorder):
    clear_frame()
    update_title_frame("DISCLAIMER")
    disclaimer_txt = ("This tool is not a substitute for professional services. Seek a qualified healthcare "
                      "professional for an accurate diagnosis.")
    update_text_frame(disclaimer_txt)
    advice_btn = tk.Button(master=mainFrame, text="Advice", command=lambda: give_conclusion(rules, current_disorder))
    advice_btn.grid(row=4, padx=5, pady=5)


# Display the final conclusion based on diagnosis
def give_conclusion(rules, current_disorder):
    clear_frame()
    print(f"[TRACE] Final conclusion for disorder: {current_disorder}")
    if "conclusion" in current_disorder:
        # Recognize and display a conclusive diagnosis
        update_title_frame("CONCLUSION")
        update_text_frame(f"The assessment suggests a diagnosis: {current_disorder.replace('conclusion ', '')}")
        print(f"[TRACE] Diagnosis concluded: {current_disorder}")
    else:
        # Fallback if no specific conclusion is recognized
        update_title_frame("CONCLUSION")
        update_text_frame("The assessment is inconclusive. Please consult a specialist.")
        print("[TRACE] Inconclusive assessment reached.")


def rule_deduction(facts, rules, current_disorder):
    print(f"\n[TRACE] Evaluating rules for disorder: {current_disorder}")
    for rule in rules:
        if rule["current disorder"] == current_disorder:
            counter = sum(1 for symptom in rule.get("required symptoms", []) if symptom in facts)
            print(f"[TRACE] Rule '{rule['current disorder']}' - Required symptoms matched: {counter} / {rule.get('number')}")
            if counter >= rule.get("number"):
                print(f"[TRACE] Moving to new direction: {rule['new direction']}")
                return rule["new direction"]
            else:
                print(f"[TRACE] Moving to else direction: {rule['else']}")
                return rule["else"]
    print("[TRACE] No matching rule found; defaulting to general conclusion.")
    return "conclusion general"


def find_disorder(current_disorder, knowledge_base):
    for item in knowledge_base:
        if item["disorder"] == current_disorder:
            return item
    print(f"[TRACE] Disorder '{current_disorder}' not found in knowledge base.")
    return {"disorder": current_disorder, "symptoms": []}


# Execute the main knowledge base interaction loop
# Execute the main knowledge base interaction loop
def execute_knowledge_base(data, filename):
    current_disorder = "dyslexia"  # Start with dyslexia as per the JSON structure
    knowledge_base = data["Knowledge base"]
    facts = data["Facts"]
    rules = data["Rules"]
    while "conclusion" not in current_disorder:
        item = find_disorder(current_disorder, knowledge_base)
        for symptom in item["symptoms"]:
            if symptom["name"] not in facts and "no " + symptom["name"] not in facts:
                print(f"\n[TRACE] Asking about symptom: {symptom['name']}")
                new_question(symptom["question"])
                mainFrame.wait_variable(user_answer_var)
                answer = symptom["name"] if user_answer_var.get() == 'yes' else "no " + symptom["name"]
                facts.append(answer)
                print(f"[TRACE] Added '{answer}' to facts")
                if user_answer_var.get() == 'close':
                    sys.exit()
                update_file(data, filename)
        current_disorder = rule_deduction(facts, rules, current_disorder)

    # Display conclusion after breaking out of the loop
    give_conclusion(rules, current_disorder)


# Main function to start the application
def main():
    filename = 'knowledge_base.json'
    data = read_file(filename)
    reset(data["Facts"], filename)
    welcome(data, filename)


if __name__ == "__main__":
    main()

# Run the main function
window.protocol("WM_DELETE_WINDOW", on_closing)
window.mainloop()
