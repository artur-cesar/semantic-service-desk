.DEFAULT_GOAL := dev
SHELL := /bin/bash

.PHONY: backend database dev frontend seed setup

backend:
	cd backend && npm run dev

database:
	cd backend && npm run db:up

frontend:
	cd frontend && npm run dev -- --host 0.0.0.0

seed:
	cd backend && npm run db:seed

setup:
	npm --prefix backend ci
	npm --prefix frontend ci
	cd backend && npm run db:up && npm run db:generate && npm run db:migrate:deploy && npm run db:seed

dev: database
	@trap 'kill $$backend_pid $$frontend_pid 2>/dev/null || true' EXIT INT TERM; \
	cd backend && npm run dev & backend_pid=$$!; \
	cd frontend && npm run dev -- --host 0.0.0.0 & frontend_pid=$$!; \
	wait -n $$backend_pid $$frontend_pid
