#!/bin/bash

echo "Setting up HydeMusic streaming app..."

# Backend setup
cd backend

python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

echo "Backend dependencies installed"

cd ..

# Frontend setup
cd frontend

npm install

echo "Frontend dependencies installed"

echo "Setup complete!"
