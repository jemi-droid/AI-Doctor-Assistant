import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("backend/dataset/Training.csv")

# Clean data
df = df.fillna(0)

# Split features & target
X = df.drop("prognosis", axis=1)
y = df["prognosis"]

# Train/test split (VERY IMPORTANT for accuracy check)
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.3,
    random_state=42,
    stratify=y
)

# Improved model
model = RandomForestClassifier(
    n_estimators=200,     # more trees = better accuracy
    max_depth=None,
    random_state=42
)

# Train
model.fit(X_train, y_train)

# Evaluate accuracy
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"✅ Model Accuracy: {acc * 100:.2f}%")

# Save feature columns
columns = X.columns


# Prediction function
def predict_disease(symptoms_list):
    input_data = [0] * len(columns)

    matched_symptoms = []

    for symptom in symptoms_list:
        if symptom in columns:
            index = list(columns).index(symptom)
            input_data[index] = 1
            matched_symptoms.append(symptom)

    # 🚨 No valid symptoms found
    if len(matched_symptoms) == 0:
        return None, 0

    prediction = model.predict([input_data])[0]

    proba = max(model.predict_proba([input_data])[0])

    return prediction, round(proba * 100, 2)