AI Dynamic Pricing Optimizer
Overview
The AI Dynamic Pricing Optimizer is a full-stack, machine-learning-driven web application designed to help businesses find the optimal price point for their products. By simulating market demand based on external variables (advertising spend, competitor pricing, and seasonality), the system calculates the exact price that maximizes total gross profit. It features a continuous learning loop, allowing the model to retrain itself as new sales data is ingested.

Key Features
Predictive Pricing Engine: Uses a Random Forest Regressor to predict unit demand based on non-linear market factors.

Real-Time Simulation: An interactive dashboard where users can adjust market variables and instantly see the projected profit and demand curves.

Continuous Learning: A data-entry interface that allows users to input recent sales data, automatically appending to the dataset and retraining the AI model on the fly.

Market History Auditing: A transparent, tabular view of the underlying historical data used to train the machine learning model.

Technology Stack
Frontend:

Framework: Next.js 14 (React)

Language: TypeScript

Styling: Tailwind CSS

Visualization: Recharts

Icons: Lucide React

Backend:

Framework: FastAPI (Python)

Server: Uvicorn

Machine Learning: Scikit-Learn (RandomForestRegressor)

Data Manipulation: Pandas, NumPy

Prerequisites
Before you begin, ensure you have the following installed on your machine:

Node.js (v18 or higher)

npm or yarn

Python (v3.8 or higher)

pip (Python package installer)

Installation and Setup
1. Clone the Repository
Bash
git clone https://github.com/yourusername/ai-dynamic-pricing.git
cd ai-dynamic-pricing
2. Backend Setup (FastAPI & Machine Learning)
Open a terminal and navigate to the project root (or a dedicated backend folder if you separate them).

Install the required Python dependencies:

Bash
pip install fastapi uvicorn scikit-learn pandas numpy pydantic
Start the backend server:

Bash
python main.py
The API will be available at http://localhost:8000.

3. Frontend Setup (Next.js)
Open a second terminal and navigate to the frontend directory.

Install the required Node dependencies:

Bash
npm install
# or
yarn install
Start the frontend development server:

Bash
npm run dev
# or
yarn dev
The application will be available at http://localhost:3000.

API Endpoints
The FastAPI backend exposes the following primary endpoints:

POST /optimize: Accepts current market conditions (cost, ad spend, competitor price, month) and returns the optimal price, expected profit, and coordinate data for the UI charts.

GET /history: Returns the tabular training data currently used by the machine learning model.

POST /history/add: Accepts a new market observation (price, ads, competitor, month, actual demand), appends it to the dataset, and triggers a model retraining sequence.

Architecture and Logic
The system relies on the fundamental economic equation for profit:
Profit = (Price - Cost) * PredictedDemand

The Random Forest model is trained to accurately forecast PredictedDemand. When a user requests an optimization, the backend generates an array of 100 possible price points, predicts the demand for each, calculates the resulting profit, and identifies the maximum value. This decoupled architecture ensures the frontend remains highly responsive while the Python backend handles heavy data processing.