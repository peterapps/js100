
start	cp	cam_scale	0x80000000
	call	cam_read	cam_ra
	be	start		0		0

// E100 camera driver

// Function: cam_read
// Input: cam_x, cam_y, cam_scale, cam_mirror

cam_read	bne	cam_read	0x800000b1	num0
		cp	0x800000b2	cam_x
		cp	0x800000b3	cam_y
		cp	0x800000b4	cam_scale
		cp	0x800000b5	cam_mirror
		cp	0x800000b0	num1
cam_read2	bne	cam_read2	0x800000b1	num1
		cp	0x800000b0	num0
		ret	cam_ra

cam_ra	0
cam_x	50
cam_y	40
cam_scale	0
cam_mirror	0


num0	0
num1	1
