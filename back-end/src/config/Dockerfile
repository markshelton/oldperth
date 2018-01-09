FROM markshelton/thickshake:latest

# Configure Python
COPY config/requirements.txt /home/app/config/
WORKDIR /home/app
RUN pip install --no-cache-dir -r config/requirements.txt

# Start Jupyter Server
CMD ["/run_jupyter.sh", "--allow-root", "--NotebookApp.token=''"]