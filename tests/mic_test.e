// Test script

start	cp	vga_x1		num0
	cp	vga_y1		num0
	cp	vga_x2		WIDTH
	cp	vga_y2		HEIGHT
	cp	vga_color_write	BLACK
	call	vga_draw_rect	vga_ra
	cp	i		num0
	cp	vga_color_write	WHITE

loop	call	mic_read	mic_ra
	cp	0x80000001	mic_sample
	cp	x		i
	div	y		mic_sample	ratio
	add	y		y		HALFHEIGHT
	cp	vga_color_write	WHITE	
	call	vga_draw_block	vga_ra
	add	i		i		num1
	bne	loop2		i		WIDTH
	cp	i		num0
	cp	vga_x1		num0
	cp	vga_y1		num0
	cp	vga_x2		WIDTH
	cp	vga_y2		HEIGHT
	cp	vga_color_write	BLACK
	call	vga_draw_rect	vga_ra
loop2	be	loop		0		0


// Microphone driver

mic_read	bne	mic_read	0x80000051	num0
		cp	0x80000050	num1
mic_read2	bne	mic_read2	0x80000051	num1
		cp	mic_sample	0x80000052
		cp	0x80000050	num0
		ret	mic_ra

num0	0
num1	1
num5	5
mic_ra	0
mic_sample	0
i	0
ratio	10947849
HALFHEIGHT	240
x	0
y	0

// VGA monitor driver

// Function: vga_draw_block
// Inputs: x, y, vga_color_write

vga_draw_block		cp	vga_ra2		vga_ra
			sub	vga_x1		x		num5
			sub	vga_y1		y		num5
			add	vga_x2		x		num5
			add	vga_y2		y		num5
			call	vga_draw_rect	vga_ra
			cp	vga_ra		vga_ra2
			ret	vga_ra

// Function: vga_draw_rect
// Inputs: vga_x1, vga_y1, vga_x2, vga_y2, vga_color_write

vga_draw_rect		bne	vga_draw_rect	0x80000061	vga_num0	// Confirm idle mode
vga_draw_rect2		cp	0x80000063	vga_x1				// Set the command parameters
			cp	0x80000064	vga_y1
			cp	0x80000065	vga_x2
			cp	0x80000066	vga_y2
			cp	0x80000067	vga_color_write
			cp	0x80000062	vga_num1
			cp	0x80000060	vga_num1			// Write 1 to vga_command
vga_draw_rect3		be	vga_draw_rect4	0x80000061	vga_num1	// Break if vga_response == 1
			be	vga_draw_rect3	0		0		// Go to vga_draw_rect_wait
vga_draw_rect4		cp	0x80000060	vga_num0
			ret	vga_ra

// VGA variables
vga_num0	0	// constant
vga_num1	1	// constant
vga_num2	2	// constant
vga_neg1	-1	// constant
vga_ra		0	// return address
vga_ra2		0	// secondary return address (pseudo call stack)

// VGA function arguments
vga_x1		0
vga_y1		0
vga_x2		0
vga_y2		0
vga_color_write	0
vga_color_read	0
vga_thickness	1

// VGA screen constants
WIDTH		639
HEIGHT		479

// VGA color constants
RED		0xff0000
GREEN		0xff00
BLUE		0xff
YELLOW		0xffff00
ORANGE		0xffbf00
CYAN		0xffff
BLACK		0x0
WHITE		0xffffff
PINK		0xff968d
SKY		0xcee7f9
SKYSHADED	0xb7d8f9

