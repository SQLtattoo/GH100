FROM scratch
LABEL org.opencontainers.image.title="GH-100 course summary"
LABEL org.opencontainers.image.description="Data-only teaching artifact; not a runnable service"
LABEL org.opencontainers.image.licenses="MIT"
COPY dist/ /course/
