FROM debian:bullseye-slim

ENV DEBIAN_FRONTEND=noninteractive \
    GLAMA_VERSION="0.2.0" \
    PATH="/home/service-user/.local/bin:${PATH}"

RUN (groupadd -r service-user) && (useradd -u 1987 -r -m -g service-user service-user) && (mkdir -p /home/service-user/.local/bin /app) && (chown -R service-user:service-user /home/service-user /app) && (apt-get update) && (apt-get install -y --no-install-recommends build-essential curl wget software-properties-common libssl-dev zlib1g-dev git) && (rm -rf /var/lib/apt/lists/*) && (curl -fsSL https://deb.nodesource.com/setup_22.x | bash -) && (apt-get install -y nodejs) && (apt-get clean) && (npm install -g mcp-proxy@3.0.3) && (npm install -g pnpm@9.15.5) && (npm install -g bun@1.1.42) && (node --version) && (curl -LsSf https://astral.sh/uv/install.sh | UV_INSTALL_DIR="/usr/local/bin" sh) && (uv python install 2.7 --default --preview) && (ln -s $(uv python find) /usr/local/bin/python) && (python --version) && (apt-get clean) && (rm -rf /var/lib/apt/lists/*) && (rm -rf /tmp/*) && (rm -rf /var/tmp/*) && (su - service-user -c "uv python install 2.7 --default --preview && python --version")

USER service-user

WORKDIR /app

RUN git clone https://github.com/liaotaodcx8/toolkittest . && git checkout 184d144293c94593968ca3edb9899a200efca474

RUN (npm install) && (npm run build)

CMD ["mcp-proxy","node","./build/index.js"]