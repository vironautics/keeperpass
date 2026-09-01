# The marketing site is hand-written HTML with no toolchain — no build stage,
# nothing to compile. The whole context is copied in as-is, then the server
# config is moved out of the document root so it isn't served as content.
FROM nginx:alpine

COPY . /usr/share/nginx/html
RUN mv /usr/share/nginx/html/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# 127.0.0.1 rather than localhost: inside the container `localhost` resolves to
# ::1 first, and nginx's `listen 80` binds IPv4 only, so the IPv6 attempt is
# refused and the container reports unhealthy while serving traffic perfectly.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
