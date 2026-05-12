-- 001_create_links.sql
-- URL Shortener-ийн үндсэн хүснэгт: богино код ↔ урт URL мэппинг

CREATE TABLE IF NOT EXISTS links (
  id           BIGSERIAL PRIMARY KEY,
  code         TEXT        NOT NULL UNIQUE,
  url          TEXT        NOT NULL,
  click_count  BIGINT      NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- code UNIQUE constraint өөрөө btree index үүсгэдэг тул `findByCode` lookup
-- O(log n)-ээр ажиллана. Нэмэлт index хэрэггүй.

-- url дээр index тавихгүй: ижил URL-ийг хэд хэдэн богино кодоор үүсгэх
-- хэрэглээний случай боломжтой (UTM сорилт, кампанит ажил гэх мэт).
