package au.com.ausstaker.cardano_dappconn_test.model;

/**
 * @author ausstaker (https://github.com/Ausstaker)
 * @since Nov 2021
 */
public class BFProtocolParametersResponse {

    Long epoch;
    Double min_fee_a;
    Double min_fee_b;
    Long max_block_size;
    Long max_tx_size;
    Long max_block_header_size;
    Double key_deposit;
    Double pool_deposit;
    Double e_max;
    Double n_opt;
    Double a0;
    Double rho;
    Double tau;
    Double decentralisation_param;
    Double extra_entropy;
    Double protocol_major_ver;
    Double protocol_minor_ver;
    Double min_utxo;
    Double min_pool_cost;
    String nonce;
    Double price_mem;
    Double price_step;
    Double max_tx_ex_mem;
    Double max_tx_ex_steps;
    Double max_block_ex_mem;
    Double max_block_ex_steps;
    Double max_val_size;
    Double collateral_percent;
    Double max_collateral_inputs;
    Double coins_per_utxo_word;
    Long latest_slot;

    public Long getEpoch() {
        return epoch;
    }

    public void setEpoch(Long epoch) {
        this.epoch = epoch;
    }

    public Double getMin_fee_a() {
        return min_fee_a;
    }

    public void setMin_fee_a(Double min_fee_a) {
        this.min_fee_a = min_fee_a;
    }

    public Double getMin_fee_b() {
        return min_fee_b;
    }

    public void setMin_fee_b(Double min_fee_b) {
        this.min_fee_b = min_fee_b;
    }

    public Long getMax_block_size() {
        return max_block_size;
    }

    public void setMax_block_size(Long max_block_size) {
        this.max_block_size = max_block_size;
    }

    public Long getMax_tx_size() {
        return max_tx_size;
    }

    public void setMax_tx_size(Long max_tx_size) {
        this.max_tx_size = max_tx_size;
    }

    public Long getMax_block_header_size() {
        return max_block_header_size;
    }

    public void setMax_block_header_size(Long max_block_header_size) {
        this.max_block_header_size = max_block_header_size;
    }

    public Double getKey_deposit() {
        return key_deposit;
    }

    public void setKey_deposit(Double key_deposit) {
        this.key_deposit = key_deposit;
    }

    public Double getPool_deposit() {
        return pool_deposit;
    }

    public void setPool_deposit(Double pool_deposit) {
        this.pool_deposit = pool_deposit;
    }

    public Double getE_max() {
        return e_max;
    }

    public void setE_max(Double e_max) {
        this.e_max = e_max;
    }

    public Double getN_opt() {
        return n_opt;
    }

    public void setN_opt(Double n_opt) {
        this.n_opt = n_opt;
    }

    public Double getA0() {
        return a0;
    }

    public void setA0(Double a0) {
        this.a0 = a0;
    }

    public Double getRho() {
        return rho;
    }

    public void setRho(Double rho) {
        this.rho = rho;
    }

    public Double getTau() {
        return tau;
    }

    public void setTau(Double tau) {
        this.tau = tau;
    }

    public Double getDecentralisation_param() {
        return decentralisation_param;
    }

    public void setDecentralisation_param(Double decentralisation_param) {
        this.decentralisation_param = decentralisation_param;
    }

    public Double getExtra_entropy() {
        return extra_entropy;
    }

    public void setExtra_entropy(Double extra_entropy) {
        this.extra_entropy = extra_entropy;
    }

    public Double getProtocol_major_ver() {
        return protocol_major_ver;
    }

    public void setProtocol_major_ver(Double protocol_major_ver) {
        this.protocol_major_ver = protocol_major_ver;
    }

    public Double getProtocol_minor_ver() {
        return protocol_minor_ver;
    }

    public void setProtocol_minor_ver(Double protocol_minor_ver) {
        this.protocol_minor_ver = protocol_minor_ver;
    }

    public Double getMin_utxo() {
        return min_utxo;
    }

    public void setMin_utxo(Double min_utxo) {
        this.min_utxo = min_utxo;
    }

    public Double getMin_pool_cost() {
        return min_pool_cost;
    }

    public void setMin_pool_cost(Double min_pool_cost) {
        this.min_pool_cost = min_pool_cost;
    }

    public String getNonce() {
        return nonce;
    }

    public void setNonce(String nonce) {
        this.nonce = nonce;
    }

    public Double getPrice_mem() {
        return price_mem;
    }

    public void setPrice_mem(Double price_mem) {
        this.price_mem = price_mem;
    }

    public Double getPrice_step() {
        return price_step;
    }

    public void setPrice_step(Double price_step) {
        this.price_step = price_step;
    }

    public Double getMax_tx_ex_mem() {
        return max_tx_ex_mem;
    }

    public void setMax_tx_ex_mem(Double max_tx_ex_mem) {
        this.max_tx_ex_mem = max_tx_ex_mem;
    }

    public Double getMax_tx_ex_steps() {
        return max_tx_ex_steps;
    }

    public void setMax_tx_ex_steps(Double max_tx_ex_steps) {
        this.max_tx_ex_steps = max_tx_ex_steps;
    }

    public Double getMax_block_ex_mem() {
        return max_block_ex_mem;
    }

    public void setMax_block_ex_mem(Double max_block_ex_mem) {
        this.max_block_ex_mem = max_block_ex_mem;
    }

    public Double getMax_block_ex_steps() {
        return max_block_ex_steps;
    }

    public void setMax_block_ex_steps(Double max_block_ex_steps) {
        this.max_block_ex_steps = max_block_ex_steps;
    }

    public Double getMax_val_size() {
        return max_val_size;
    }

    public void setMax_val_size(Double max_val_size) {
        this.max_val_size = max_val_size;
    }

    public Double getCollateral_percent() {
        return collateral_percent;
    }

    public void setCollateral_percent(Double collateral_percent) {
        this.collateral_percent = collateral_percent;
    }

    public Double getMax_collateral_inputs() {
        return max_collateral_inputs;
    }

    public void setMax_collateral_inputs(Double max_collateral_inputs) {
        this.max_collateral_inputs = max_collateral_inputs;
    }

    public Double getCoins_per_utxo_word() {
        return coins_per_utxo_word;
    }

    public void setCoins_per_utxo_word(Double coins_per_utxo_word) {
        this.coins_per_utxo_word = coins_per_utxo_word;
    }

    public Long getLatest_slot() {
        return latest_slot;
    }

    public void setLatest_slot(Long latest_slot) {
        this.latest_slot = latest_slot;
    }
}
