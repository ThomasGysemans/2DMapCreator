# 2DMapCreator

Create your own 2D Map pixel by pixel and download a PNG or a CSV file useful to reproduce it on a Terminal.

> **NOTE**: the whole site is in French.

## What is it used for?

Basically, this whole project is a tool that helped me generate specific data models for maps I displayed within a Terminal using ANSI. Just... for a simple school project...

Draw maps where each pixel is a color defined in the color chart. Each color has a unique number and cannot be changed. This number is used to define each element of the matrix, with -1 for transparent pixels. The CSV files are then generated and downloaded in a very specific format.

I wanted to build a RPG game inside any Terminal so I needed maps - plenty of them - and easy ways to represent data. I also had to create paths between maps so that the player can move freely in his "world". I call that "teleportations".

## Get started

The website is available for everyone https://2dmapcreator.sciencesky.fr

At the left, you have a sidebar that allows you to :

- Log in to your account, create one or log out.
- Import a CSV file (a map, a chart or a teleportation file)
- Open the chart
- Open the teleportations
- Downlaod the current map
- Generate a PNG image of your current map

At the right you see the list of all your projects. The first one will always be the latest saved version of the map currently being displayed in the middle. This is the _selected map_.

## Technologies used for this project

- NextJS
- TypeScript
- SCSS
- Firebase (database)
- Vercel (host)

## The project it was used for

This sole purpose of this website is to create the data I needed for my game. Here the [repository of the game](https://github.com/CodoPixel/IUT-Microsoft-World-Conquest) (in French).

## License

MIT License