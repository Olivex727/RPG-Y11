using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace TileRPG
{
    public partial class Game : Form
    {
        //Player Creation
        PictureBox player = new PictureBox();
        //string player_x = Console.ReadLine ();
        //string player_y = Console.ReadLine ();

        List<PictureBox> obj = new List<PictureBox>();

        //Global x and y values for player pos in world
        int global_x = 100;
        int global_y = 98;

        //Stores Previous Locations for solid objects
        int prev_x = 0;
        int prev_y = 0;

        //Allows Procedure Generation
        bool col = false;

        //Int32.TryParse(Console.ReadLine(), out global_x);
        //Int32.TryParse(Console.ReadLine(), out global_y);
        //Local x and y values for the player pos in screen
        int local_x = 535;
        int local_y = 313;

        //Loclist creation
        List<location> loclist = new List<location>();

        //Model Index Creation
        List<model> models = new List<model>();

        // G = Game, C = Cutscene, I = Invent, M = Menu
        char Int = 'G';
        // Display Feild Interface
        bool keepFeild = true;

        public Game()
        {
            InitializeComponent();
        }

        private void Game_Load(object sender, EventArgs e)
        {
            Console.WriteLine("START TEST");

            //int local_x = this.Width / 2 - 50;
            //int local_y = this.Height / 2 - 50;

            //Can be used to load on models (Mabye also locations)
            //setModelArray();

            //Object declaration
            location barrel = new location()
            {
                x_pos = new int[] { 10, 50, 90, 60 },
                y_pos = new int[] { 31, 50, 90, 10 },
                checkPoly = false,
                collisionID = "2",
                modelID = "barrel"
            };
            loclist.Add(barrel);

            location table = new location()
            {
                x_pos = new int[] { 30, 60, 20, 10 },
                y_pos = new int[] { 10, 80, 100, 30 },
                checkPoly = false,
                collisionID = "2",
                modelID = "table"
            };
            loclist.Add(table);

            location crate = new location()
            {
                x_pos = new int[] { 18, 59, 21, 26 },
                y_pos = new int[] { 41, 32, 78, 82 },
                checkPoly = false,
                collisionID = "2",
                modelID = "matcrate"
            };
            loclist.Add(crate);

            location grass = new location()
            {
                x_pos = new int[] { 19, 60, 20, 26, 96, 103, 110 },
                y_pos = new int[] { 20, 30, 70, 82, 96, 100, 110 },
                checkPoly = true,
                len = new int[] { 3, 6, 2, 1, 9, 2, 50 },
                top = new int[] { 1, 20, 2, 1, 4, 6, 50 },
                collisionID = "1",
                modelID = "matgrass"
            };
            loclist.Add(grass);

            location wall = new location()
            {
                x_pos = new int[] { 95, 95, 105, 95 },
                y_pos = new int[] { 95, 96, 95, 100 },
                checkPoly = true,
                len = new int[] { 10, 1, 1, 8 },
                top = new int[] { 1, 4, 6, 1 },
                collisionID = "3",
                modelID = "wall"
            };
            loclist.Add(wall);

            //Initial positioning of player
            createPlayer(local_x, local_y);
            getLoc(loclist);

            //Console.WriteLine(loclist);

            //getLoc(loclist);//, global_x, global_y, local_x, local_y);
        }

        private void Game_KeyPress(object sender, KeyPressEventArgs e)
        {
            prev_x = 0;
            prev_y = 0;

            if (e.KeyChar.ToString() == "w")
            {
                global_y += -1;
                prev_y += -1;

            }
            if (e.KeyChar.ToString() == "s")
            {
                global_y += 1;
                prev_y += 1;

            }
            if (e.KeyChar.ToString() == "a")
            {
                global_x += -1;
                prev_x += -1;

            }
            if (e.KeyChar.ToString() == "d")
            {
                global_x += 1;
                prev_x += 1;

            }
            if (e.KeyChar.ToString() == " ")
            {
                Int = 'I';

            }
            //Procedure Generates on key moves
            //Console.WriteLine("Key = {0}, x = {1}, y = {2}", e.KeyChar.ToString(),global_x, global_y);
            removeLoc();
            getLoc(loclist);
            //checkCollision();
            checkCollision();
        }

        //Transferring locations to physical objects
        private void getLoc(List<location> loclist)//, int global_x, int global_y, int local_x, int local_y)
        {
            foreach (location l in loclist)
            {
                for (int i = 0; i < l.x_pos.Length; i++)
                {
                    int x = l.x_pos[i];
                    int y = l.y_pos[i];
                    int Sy = 0;
                    int Sx = 0;

                    if (l.checkPoly)
                    {
                        Sy = l.top[i];
                        Sx = l.len[i];
                    }
                    //foreach (int y in l.y_pos) {
                    //for (int offsetx = 0; offsetx < Sx; offsetx++)
                    //{
                    //for (int offsety = 0; offsety < Sy; offsety++)
                    //{
                    if (x >= (global_x - 12) - Sx && x <= global_x + 12 + Sx)
                    {
                        if (y >= (global_y - 10) - Sy && y <= global_y + 10 + Sy)
                        {
                            if (l.checkPoly)
                            {

                                PictureBox pic = new PictureBox();
                                pic.Name = l.collisionID;
                                pic.Tag = l.modelID;
                                pic.Location = new Point(local_x + (getDis(x, global_x)) * 50 + 0, local_y + (getDis(y, global_y)) * 50 + 0);

                                //CHANGE ON MODEL DIR
                                pic.Size = new Size(50 * Sx, 50 * Sy);

                                //Set default Color
                                if (l.collisionID == "3")
                                {
                                    pic.BackColor = Color.Blue;
                                }
                                else
                                {
                                    pic.BackColor = Color.Green;
                                }

                                foreach (model m in models)
                                {
#pragma warning disable CS0252
                                    if (pic.Tag == m.modelID)
#pragma warning restore CS0252
                                    {
                                        if (m.modelType == 1)
                                        {
                                            pic.BackColor = m.color;
                                        }
                                        if (m.modelType == 2)
                                        {
                                            //Add a Image to the pic
                                        }
                                    }

                                }

                                //EXIT MODEL
                                Controls.Add(pic);
                                obj.Add(pic);
                            }
                        }
                    }
                    // }
                    // }

                    if (x >= (global_x - 12) && x <= global_x + 12)
                    {
                        if (y >= (global_y - 10) && y <= global_y + 10)
                        {
                            if (l.checkPoly == false)
                            {

                                PictureBox pic = new PictureBox();
                                pic.Name = l.collisionID;
                                pic.Tag = l.modelID;
                                pic.Location = new Point(local_x + (getDis(x, global_x)) * 50 + 0, local_y + (getDis(y, global_y)) * 50 + 0);

                                //CHANGE ON MODEL DIR
                                pic.Size = new Size(50, 50);
                                //Set default colour
                                pic.BackColor = Color.Cyan;

                                foreach (model m in models)
                                {
#pragma warning disable CS0252
                                    if (pic.Tag == m.modelID)
#pragma warning restore CS0252
                                    {
                                        if (m.modelType == 1)
                                        {
                                            pic.BackColor = m.color;
                                        }
                                        if (m.modelType == 2)
                                        {
                                            //Add a Image to the pic
                                        }
                                    }

                                }


                                //EXIT MODEL
                                Controls.Add(pic);
                                obj.Add(pic);
                            }
                        }
                    }

                    //object.Name = colID,
                    //object Picture/coulor/size = modID 
                    //local_x/y = screen position

                    //Console.WriteLine(
                    // "x_pos={0}, y_pos={1}, colID={2}, modID={3}, local_x={4}, local_y={5}, scn_x={6}, scn_y={7}",
                    //  x,
                    //  y,
                    //  l.collisionID,
                    //  l.modelID,
                    //  local_x,
                    //  local_y,
                    //  local_x + (getDis(x, global_x))*50,
                    //  local_y + (getDis(y, global_y))*50
                    //);



                }
            }
        }

        //Clearing Objects to stop lagging
        private void removeLoc()
        {
            //int i = 0;
            foreach (PictureBox p in obj)
            {
                //Console.WriteLine("lol {0}", p.Name);
                p.BackColor = this.BackColor;
                Controls.Remove(p);
                p.Dispose();
            }
            obj.Clear();
        }

        private void removeBox(PictureBox p)
        {
            p.BackColor = this.BackColor;
            Controls.Remove(p);
            obj.Remove(p);
            p.Dispose();
        }

        //Doing Maths to calculate Object positions
        private static int getDis(int obj_pos, int global_pos)
        {
            return (obj_pos - global_pos);
        }

        //Assigning Player properties
        private void createPlayer(int x, int y)
        {
            PictureBox player = new PictureBox
            {
                Size = new Size(50, 50),
                Name = "player",
                BackColor = Color.Red,
                Location = new Point(this.Width / 2 - 50, this.Height / 2 - 50)
            };
            Controls.Add(player);
            //Console.WriteLine(player.Location);
        }

        //Not used.
        private void updatePlayerLoc(int y, int x)
        {
            //player.Location = new Point(this.Width / 2 - 50, this.Height / 2 - 50);
        }

        //Standard Short Timer
        private void timer1_Tick(object sender, EventArgs e)
        {
            //updatePlayerLoc(this.Height, this.Width);
            //Console.WriteLine(this.Width);
            //getLoc(loclist);
            changeInterface();
            //removeLoc();
            label2.Text = "x=" + global_x.ToString() + " y=" + global_y.ToString() + " entity=" + obj.Count.ToString();
            if (col == true)
            {
                removeLoc();
                getLoc(loclist);
                //checkCollision();
                checkCollision();
                col = false;
            }
        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        //int changeEntity = 0;

        private void clearObjTime_Tick(object sender, EventArgs e)
        {
            //if (changeEntity == 0)
            //{
            //    global_x += 1;
            //    changeEntity = 100;
            //}
            //if (changeEntity == 100)
            //{
            //    global_x += -1;
            //    changeEntity += -1;
            //}

        }

        //Used For changing Interfaces
        private void changeInterface()
        {
            if (Int == 'G')
            {
                keepFeild = true;
                label3.Text = "";
            }
            if (Int == 'C')
            {
                keepFeild = true;
                label3.Text = "SAMPLE TEXT";
            }
            if (Int == 'I')
            {
                Close();
            }
        }

        private void label3_Click(object sender, EventArgs e)
        {

        }

        //Checking collisions for interactables or other events
        private void checkCollision()
        {
            foreach (PictureBox p in obj)
            {
                foreach (PictureBox a in Controls.OfType<PictureBox>())
                {
                    //Console.WriteLine("{0}, {1}", Convert.ToInt32(p.Name), p.BackColor);
                    //Console.WriteLine(player.BackColor);
                    if (a.Name == "player")
                    {
                        if ((p.Name.EndsWith("2") || p.Name.EndsWith("3")) && p.Bounds.IntersectsWith(a.Bounds))
                        {
                            //Console.WriteLine("gx={0}, px={1}", global_x, prev_x);
                            global_x += -prev_x;
                            global_y += -prev_y;
                            col = true;

                            if (p.Name.EndsWith("3"))
                            {
                                //Add all collision events
                                //to clear objects removeBox
                            }

                        }
                    }
                }
            }
        }

        //Changes Interface to 'M' for menu
        private void label4_Click(object sender, EventArgs e)
        {

        }
    }

    //Locations are the stored versions of the in-game objects
    public class location
    {
        //Position of object in world
        //Use local_pos - getDis to determine position in screen
        public int[] x_pos { get; set; }
        public int[] y_pos { get; set; }
        //check polygons
        public bool checkPoly { get; set; }
        //Width / Length of object
        public int[] len { get; set; }
        public int[] top { get; set; }
        //Name of object's ID for interactions
        public string collisionID { get; set; }
        //Name of object's ID for models and hitboxes
        public string modelID { get; set; }
        //1=no interaction and non-solid, 2=no interaction but solid, 3=interactable and solid
    }

    //Models are the properties of the object reguarding Colour and Image
    public class model
    {
        public string modelID { get; set; }
        public int modelType { get; set; }
        //1 is Colour, 2 is Image
        public Color color { get; set; }
        public string[] imgName { get; set; }
    }
}
