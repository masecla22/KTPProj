import json

def reset(facts, filename):
    facts.clear()
    with open(filename, "r") as file:
        data = json.load(file)
    data["Facts"] = facts
    update_file(data, filename)

def update_file(data, filename):
    with open(filename, "w") as file:
        json.dump(data, file, indent=4)

def read_file(filename):
    with open(filename, "r") as file:
        return json.load(file)

def questions_to_ask(disorders, facts):  # Ensure proper indentation level here
    for symptom in disorders:
        answer = input(f"{symptom['name']} (1 to 5): ")
        facts.append((symptom["name"], answer))

def calc_disorders_to_investigate(curr_disorder, rules, facts, current_disorders, knowledge_base):
    ruleset_for_curr_disorder = next(
        (rule for rule in rules if rule["current_disorder"] == curr_disorder["disorder"]), None
    )

    for movement_option in ruleset_for_curr_disorder["movement_options"]:
        number_required = movement_option["number"]
        disorder_direction = movement_option["new_direction"]

        for symptom in movement_option["required_symptoms"]:
            key, value = list(symptom.items())[0]
            fact = next((f for f in facts if f[0] == key), None)

            if fact:
                threshold = int(value[1:])
                if (">" in value and int(fact[1]) > threshold) or ("<" in value and int(fact[1]) < threshold):
                    number_required -= 1
                    if number_required < 0:
                        number_required = 0  # Prevent over-decrementing

        print(f"Final Number Required for {disorder_direction}: {number_required}")
        if number_required <= 0:
            disorder = next((d for d in knowledge_base if d["disorder"] == disorder_direction), None)
            print(f"Disorder direction: {disorder_direction}")
            if disorder:
                print("Adding in " + disorder["disorder"])
                current_disorders.append(disorder)

            print("\n")

def RunThrough(knowledge_base, rules):
    disorders = []
    facts = []
    for key in knowledge_base:
        disorders.append(key)

    current_disorders = [disorders[0]]

    # Loop until all disorders are processed
    while current_disorders:
        disorder = current_disorders.pop(0)  # Use pop(0) for FIFO processing
        questions_to_ask(disorder["symptoms"], facts)
        calc_disorders_to_investigate(disorder, rules, facts, current_disorders, knowledge_base)


def main():
    filename = 'knowledge_base.json'
    data = read_file(filename)
    RunThrough(data["Knowledge base"], data["Rules"])

if __name__ == "__main__":
    main()
