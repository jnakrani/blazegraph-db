## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js and Yarn
- Python 3.x

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/repo_name.git
   cd repo_name
   ```
2. **Set up the backend:**

   ```bash
   cd backend
   sudo apt-get update && sudo apt-get install python3-dev default-libmysqlclient-dev
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Set up the frontend:**

   ```bash

   cd ../frontend
   npm install
   npm run dev
   ```

4. **Run Blazegraph Docker Compose:**

   ```bash

   docker-compose up --build
   ```
   after visit http://localhost:9999/bigdata to access blazegraph workbench
