package au.com.ausstaker.cardano_dappconn_test.model;

/**
 * @author edge2ipi (https://github.com/Ausstaker)
 * @since Nov 2021
 */
public class BFLatestBlocksResponse {

    Long time;
    Long height;
    String hash;
    Long slot;
    Long epoch;
    Long epoch_slot;
    String slot_leader;
    Long size;
    Long tx_count;
    String output;
    String fees;
    String block_vrf;
    String previous_block;
    String next_block;
    Long confirmations;

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public Long getHeight() {
        return height;
    }

    public void setHeight(Long height) {
        this.height = height;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public Long getSlot() {
        return slot;
    }

    public void setSlot(Long slot) {
        this.slot = slot;
    }

    public Long getEpoch() {
        return epoch;
    }

    public void setEpoch(Long epoch) {
        this.epoch = epoch;
    }

    public Long getEpoch_slot() {
        return epoch_slot;
    }

    public void setEpoch_slot(Long epoch_slot) {
        this.epoch_slot = epoch_slot;
    }

    public String getSlot_leader() {
        return slot_leader;
    }

    public void setSlot_leader(String slot_leader) {
        this.slot_leader = slot_leader;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public Long getTx_count() {
        return tx_count;
    }

    public void setTx_count(Long tx_count) {
        this.tx_count = tx_count;
    }

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public String getFees() {
        return fees;
    }

    public void setFees(String fees) {
        this.fees = fees;
    }

    public String getBlock_vrf() {
        return block_vrf;
    }

    public void setBlock_vrf(String block_vrf) {
        this.block_vrf = block_vrf;
    }

    public String getPrevious_block() {
        return previous_block;
    }

    public void setPrevious_block(String previous_block) {
        this.previous_block = previous_block;
    }

    public String getNext_block() {
        return next_block;
    }

    public void setNext_block(String next_block) {
        this.next_block = next_block;
    }

    public Long getConfirmations() {
        return confirmations;
    }

    public void setConfirmations(Long confirmations) {
        this.confirmations = confirmations;
    }
}
