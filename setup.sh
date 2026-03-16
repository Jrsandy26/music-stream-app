#!/bin/bash

echo "Setting up HydeMusic streaming app..."

# Backend setup
cd backend

conda activate base
venv\Scripts\activate

pip install -r requirements.txt

echo "Backend dependencies installed"

cd ..

# Frontend setup
cd frontend

npm install

echo "Frontend dependencies installed"

echo "Setup complete!"
