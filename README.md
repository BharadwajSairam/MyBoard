# MyBoard
Collaborative Drawing Board using nodeJS, expressJS, socketio, consensus algorithm.
Executing Application:
1. run "node index.js" in terminal
2. Enter username to draw on the whiteboard
3. If you are the leader to the whiteboard you will have save canvas enabled.
4. Other users can join the drawing board while you are working on it and parallelly draw on the same drawing board,
   the changes made can be seen by all the users logged into the drawing board.
5. Leader can save the drawing, Once the leader clicks on saveCanvas the other users will be notified whether they want to save the drawing or not.
6. Once the consensus is achieved by more than 50% of the users the drawing will be saved.

