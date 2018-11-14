function State(req,res) {
    res.json({
        state: mp.Game.state
    });
}
module.exports = {
    state: State
};