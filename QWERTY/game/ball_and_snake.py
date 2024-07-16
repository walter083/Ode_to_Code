import tkinter as tk
from tkinter import messagebox
import random

# Constants
GRID_SIZE = 20  # Size of each grid cell in pixels
GRID_WIDTH = 30  # Number of grid cells in width
GRID_HEIGHT = 20  # Number of grid cells in height
INITIAL_SPEED = 150  # Initial speed of the game (in milliseconds)

class SnakeGame:
    def __init__(self, master):
        self.master = master
        self.master.title("Snake Game")
        
        self.canvas = tk.Canvas(master, width=GRID_WIDTH * GRID_SIZE, height=GRID_HEIGHT * GRID_SIZE, bg='black')
        self.canvas.pack()
        
        self.snake = [(6, 6), (6, 7), (6, 8)]  # Initial snake position
        self.food = self.generate_food()
        self.direction = 'Right'
        self.score = 0
        self.speed = INITIAL_SPEED
        self.game_over = False
        
        self.draw_snake()
        self.draw_food()
        
        self.master.bind("<KeyPress>", self.change_direction)
        self.update()

    def draw_snake(self):
        self.canvas.delete(tk.ALL)
        for segment in self.snake:
            x, y = segment
            self.canvas.create_rectangle(x * GRID_SIZE, y * GRID_SIZE, (x + 1) * GRID_SIZE, (y + 1) * GRID_SIZE, fill='green')
    
    def draw_food(self):
        x, y = self.food
        self.canvas.create_oval(x * GRID_SIZE, y * GRID_SIZE, (x + 1) * GRID_SIZE, (y + 1) * GRID_SIZE, fill='red')
    
    def generate_food(self):
        while True:
            x = random.randint(0, GRID_WIDTH - 1)
            y = random.randint(0, GRID_HEIGHT - 1)
            if (x, y) not in self.snake:
                return (x, y)
    
    def move_snake(self):
        if self.game_over:
            return
        
        head_x, head_y = self.snake[-1]
        if self.direction == 'Left':
            new_head = (head_x - 1, head_y)
        elif self.direction == 'Right':
            new_head = (head_x + 1, head_y)
        elif self.direction == 'Up':
            new_head = (head_x, head_y - 1)
        elif self.direction == 'Down':
            new_head = (head_x, head_y + 1)
        
        if (new_head in self.snake[:-1] or  # Check if snake runs into itself
            new_head[0] < 0 or new_head[0] >= GRID_WIDTH or  # Check if snake runs into walls
            new_head[1] < 0 or new_head[1] >= GRID_HEIGHT):
            self.game_over = True
            self.show_game_over_message()
        else:
            self.snake.append(new_head)
            if new_head == self.food:
                self.score += 10
                self.speed -= 2
                self.food = self.generate_food()
            else:
                self.snake.pop(0)
    
    def change_direction(self, event):
        if event.keysym == 'Left' and self.direction != 'Right':
            self.direction = 'Left'
        elif event.keysym == 'Right' and self.direction != 'Left':
            self.direction = 'Right'
        elif event.keysym == 'Up' and self.direction != 'Down':
            self.direction = 'Up'
        elif event.keysym == 'Down' and self.direction != 'Up':
            self.direction = 'Down'
    
    def update(self):
        self.move_snake()
        self.draw_snake()
        self.draw_food()
        
        if not self.game_over:
            self.master.after(self.speed, self.update)
    
    def show_game_over_message(self):
        messagebox.showinfo("Game Over", f"Game Over!\nScore: {self.score}")
        self.master.destroy()

# Main function to start the game
def main():
    root = tk.Tk()
    game = SnakeGame(root)
    root.mainloop()

if __name__ == "__main__":
    main()
