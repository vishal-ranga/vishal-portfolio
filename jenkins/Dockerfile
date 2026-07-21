FROM jenkins/jenkins:lts

USER root

# Install required packages
RUN apt-get update && \
    apt-get install -y \
        curl \
        wget \
        gnupg \
        lsb-release \
        ca-certificates \
        git && \
    rm -rf /var/lib/apt/lists/*

# ----------------------------
# Install Node.js 22
# ----------------------------
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# ----------------------------
# Install Docker CLI
# ----------------------------
RUN install -m 0755 -d /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg \
    | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    chmod a+r /etc/apt/keyrings/docker.gpg && \
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
      > /etc/apt/sources.list.d/docker.list && \
    apt-get update && \
    apt-get install -y \
      docker-ce-cli \
      docker-compose-plugin && \
    rm -rf /var/lib/apt/lists/*

USER root

RUN usermod -aG root jenkins

USER jenkins