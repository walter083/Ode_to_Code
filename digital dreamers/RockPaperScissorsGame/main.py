import pygame
import random


# Initialize the pygame
pygame.init()
screen = pygame.display.set_mode((400, 600))

# sounds
button_click_sfx = pygame.mixer.Sound("Sounds/button_click.mp3")
woosh_sfx = pygame.mixer.Sound("Sounds/woosh.mp3")
lose_sfx = pygame.mixer.Sound("Sounds/lose.mp3")
win_sfx = pygame.mixer.Sound("Sounds/win.mp3")
pygame.mixer.music.load("Sounds/background.mp3")
pygame.mixer.music.play(-1)


# title and icon
pygame.display.set_caption("Rock Paper Scissors!")
icon = pygame.image.load("Images/icon.png")
pygame.display.set_icon(icon)

# Background Image
background = pygame.image.load("Images/Background.png")

# Scoreboard Image
scoreboard = pygame.image.load("Images/Scoreboard.png")

# Hand Images
player_rock = pygame.image.load("Images/PlayerRock.png")
player_paper = pygame.image.load("Images/PlayerPaper.png")
player_scissors = pygame.image.load("Images/PlayerScissors.png")

bot_rock = pygame.image.load("Images/BotRock.png")
bot_paper = pygame.image.load("Images/BotPaper.png")
bot_scissors = pygame.image.load("Images/BotScissors.png")

handX = 140
player_hand_Y = 390
bot_hand_Y = 50
player_hand_Y_min = 700
bot_hand_Y_min = -220
player_hand_Y_max = 390
bot_hand_Y_max = 50

# Button Images
rock_button = pygame.image.load("Images/rockButton.png")
paper_button = pygame.image.load("Images/paperButton.png")
scissors_button = pygame.image.load("Images/scissorsButton.png")
rock_buttonX = 25
paper_buttonX = 150
scissors_buttonX = 275
buttonY = 480
play_button = pygame.image.load("Images/playButton.png")
replay_button = pygame.image.load("Images/replayButton.png")
play_buttonX = 135
play_buttonY = 300
# Lives
player_lives_value = 3
player_lives_font = pygame.font.Font('Fonts/FredokaOne-Regular.ttf', 20)

bot_lives_value = 3
bot_lives_font = pygame.font.Font('Fonts/FredokaOne-Regular.ttf', 20)

lives_set = False

# Announcement
announcement_font = pygame.font.Font('Fonts/FredokaOne-Regular.ttf', 20)
announcement_text = 'Press your choice'
announcement_pos = (120, 300)
choose_pos = (120, 300)
result_pos = (180, 300)

# Game title text
gameTitle = pygame.image.load("Images/gameTitle.png")

# Game over text
gameOverPlayer = pygame.image.load("Images/PlayerWin.png")
gameOverBot = pygame.image.load("Images/BotWin.png")

# Game logic variables
choices = ["rock", "paper", "scissors"]
player_choice = ""
prev_player_choice = ""
bot_choice = ""
prev_bot_choice = ""
result = ""


def show_lives():
    plr = player_lives_font.render(f'x{player_lives_value}', True, (255, 255, 255))
    screen.blit(plr, (140, 30))
    bot = player_lives_font.render(f'x{bot_lives_value}', True, (255, 255, 255))
    screen.blit(bot, (345, 30))


def show_game_over():
    if game_state == "gameOverPlayerWin":
        screen.blit(gameOverPlayer, (37, 200))
    elif game_state == "gameOverBotWin":
        screen.blit(gameOverBot, (37, 200))
    screen.blit(replay_button, (play_buttonX, play_buttonY))


def show_game_title():
    screen.blit(gameTitle, (15, 100))
    screen.blit(play_button, (play_buttonX, play_buttonY))


def show_announcement():
    if game_state == "choosing" or game_state == "removingHands":
        text = announcement_font.render(announcement_text, True, (0, 56, 119))
        screen.blit(text, announcement_pos)


def show_buttons():
    screen.blit(rock_button, (rock_buttonX, buttonY))
    screen.blit(paper_button, (paper_buttonX, buttonY))
    screen.blit(scissors_button, (scissors_buttonX, buttonY))


def make_choice(choice):
    global game_state
    global player_choice
    global bot_choice
    global prev_player_choice
    global prev_bot_choice
    if choice == "":
        prev_player_choice = player_choice
        prev_bot_choice = bot_choice
        if game_state == "showingHands":
            set_lives()
            game_state = "removingHands"
        elif game_state == "removingHands":
            game_state = "choosing"

        player_choice = choice
        bot_choice = choice
    else:
        player_choice = choice
        bot_choice = random.choice(choices)


def get_result():
    global player_lives_value
    global bot_lives_value
    if player_choice == bot_choice:
        return "tie"
    elif (player_choice == "rock" and bot_choice == "scissors") or (
            player_choice == "paper" and bot_choice == "rock") or (
            player_choice == "scissors" and bot_choice == "paper"):
        return "win"
    else:
        return "lose"


def check_status():
    global game_state
    if game_state == "choosing":
        if player_lives_value == 0:
            game_state = "gameOverBotWin"
        elif bot_lives_value == 0:
            game_state = "gameOverPlayerWin"


def set_lives():
    global player_lives_value
    global bot_lives_value
    if prev_player_choice == prev_bot_choice:
        pass
    elif (prev_player_choice == "rock" and prev_bot_choice == "scissors") or (
            prev_player_choice == "paper" and prev_bot_choice == "rock") or (
            prev_player_choice == "scissors" and prev_bot_choice == "paper"):
        bot_lives_value -= 1
        win_sfx.play()
    else:
        player_lives_value -= 1
        lose_sfx.play()


def show_hands():
    global announcement_text
    global announcement_pos
    global lives_set
    if player_choice == "":
        if prev_player_choice == "rock":
            screen.blit(player_rock, (handX, player_hand_Y))
        elif prev_player_choice == "paper":
            screen.blit(player_paper, (handX, player_hand_Y))
        elif prev_player_choice == "scissors":
            screen.blit(player_scissors, (handX, player_hand_Y))
    else:
        if player_choice == "rock":
            screen.blit(player_rock, (handX, player_hand_Y))
        elif player_choice == "paper":
            screen.blit(player_paper, (handX, player_hand_Y))
        elif player_choice == "scissors":
            screen.blit(player_scissors, (handX, player_hand_Y))
    if bot_choice == "":
        if prev_bot_choice == "rock":
            screen.blit(bot_rock, (handX, bot_hand_Y))
        elif prev_bot_choice == "paper":
            screen.blit(bot_paper, (handX, bot_hand_Y))
        elif prev_bot_choice == "scissors":
            screen.blit(bot_scissors, (handX, bot_hand_Y))
    else:
        if bot_choice == "rock":
            screen.blit(bot_rock, (handX, bot_hand_Y))
        elif bot_choice == "paper":
            screen.blit(bot_paper, (handX, bot_hand_Y))
        elif bot_choice == "scissors":
            screen.blit(bot_scissors, (handX, bot_hand_Y))

    if game_state == "choosing":
        announcement_text = 'Press your choice'
        announcement_pos = choose_pos
    elif game_state == "showingHands":
        announcement_text = get_result()
        announcement_pos = result_pos
    elif game_state == "removingHands":
        announcement_pos = result_pos


# Game state
game_state = "titleScreen"

# Game loop
running = True
while running:
    screen.fill((255, 255, 255))
    screen.blit(background, (0, 0))

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            mouse_pos = event.pos
            if game_state == "choosing":
                if rock_buttonX <= mouse_pos[0] <= rock_buttonX + 99 and buttonY <= mouse_pos[1] < buttonY + 105:
                    game_state = "showingHands"
                    button_click_sfx.play()
                    woosh_sfx.play()
                    make_choice("rock")
                elif paper_buttonX <= mouse_pos[0] <= paper_buttonX + 99 and buttonY <= mouse_pos[1] < buttonY + 105:
                    game_state = "showingHands"
                    button_click_sfx.play()
                    woosh_sfx.play()
                    make_choice("paper")
                elif scissors_buttonX <= mouse_pos[0] <= scissors_buttonX + 99 and buttonY <= mouse_pos[
                    1] < buttonY + 105:
                    game_state = "showingHands"
                    button_click_sfx.play()
                    woosh_sfx.play()
                    make_choice("scissors")
                player_hand_Y = 580
                bot_hand_Y = -140
            elif game_state == "gameOverPlayerWin" or game_state == "gameOverBotWin":
                if play_buttonX <= mouse_pos[0] <= play_buttonX + 130 and play_buttonY <= mouse_pos[
                    1] <= play_buttonY + 139:
                    button_click_sfx.play()
                    player_lives_value = 3
                    bot_lives_value = 3
                    game_state = "choosing"
            elif game_state == "titleScreen":
                if play_buttonX <= mouse_pos[0] <= play_buttonX + 130 and play_buttonY <= mouse_pos[
                    1] <= play_buttonY + 139:
                    button_click_sfx.play()
                    player_lives_value = 3
                    bot_lives_value = 3
                    game_state = "choosing"
    check_status()
    if game_state == "choosing":
        show_buttons()
        show_announcement()
        screen.blit(scoreboard, (0, 0))
        show_lives()
    elif game_state == "showingHands":
        player_hand_Y -= 2
        bot_hand_Y += 2
        if player_hand_Y <= player_hand_Y_max or bot_hand_Y >= bot_hand_Y_max:
            player_hand_Y = player_hand_Y_max
            bot_hand_Y = bot_hand_Y_max
            make_choice("")
        show_hands()
        show_announcement()
        screen.blit(scoreboard, (0, 0))
        show_lives()
    elif game_state == "removingHands":
        player_hand_Y += 1
        bot_hand_Y -= 1
        if player_hand_Y >= player_hand_Y_min or bot_hand_Y <= bot_hand_Y_min:
            player_hand_Y = player_hand_Y_min
            bot_hand_Y = bot_hand_Y_min
            make_choice("")
        show_hands()
        show_announcement()
        screen.blit(scoreboard, (0, 0))
        show_lives()
    elif game_state == "gameOverPlayerWin":
        screen.blit(scoreboard, (0, 0))
        show_lives()
        show_game_over()
    elif game_state == "gameOverBotWin":
        screen.blit(scoreboard, (0, 0))
        show_lives()
        show_game_over()
    elif game_state == "titleScreen":
        show_game_title()
    pygame.display.update()

pygame.quit()