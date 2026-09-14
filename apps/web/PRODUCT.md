# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router), React, React Konva, Tailwind CSS, TypeScript.

## Users

Designers and creators who need a fast, robust web-based design canvas for creating layouts, adding text, shapes, and images.

## Product Purpose

A robust design canvas application allowing users to create, edit, save, and export graphical layouts. Success means a smooth, performant canvas editor with autosave, a dashboard to manage multiple canvases, and seamless authentication.

## Positioning

A lightweight, developer-friendly online design canvas emphasizing speed, robust layer management, and a clean interface powered by React Konva and Next.js.

## Operating Context

Used in web browsers. Users interact primarily via mouse/trackpad (drag, drop, resize, rotate) and keyboard shortcuts. 

## Capabilities and Constraints

- Authentication (Login/Signup via JWT).
- Dashboard for managing multiple canvases (workspaces).
- Canvas Editor: Add Rectangles, Circles, Text, Images, Lines/Arrows.
- Selection, drag, resize, rotate, delete.
- Properties panel to edit x/y, width/height, rotation, color, and text content.
- Autosave (debounced) and manual save.
- Undo/Redo history stack (capped at 50).
- Fixed canvas size with pan & zoom.
- Cloudinary for image and thumbnail storage.

## Brand Commitments

Polished dark-mode with sidebar and toolbar.

## Evidence on Hand

Backend API is fully built (Express + MongoDB). Prisma schemas define User and Canvas. Auth and CRUD endpoints are verified.
