package au.com.ausstaker.cardano_dappconn_test.validator;

import au.com.ausstaker.cardano_dappconn_test.model.ProtocolParametersRequestForm;
import org.apache.commons.validator.GenericValidator;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

/**
 * @author ausstaker (https://github.com/Ausstaker)
 * @since Nov 2021
 */
@Component("protocolParametersValidator")
public class ProtocolParametersValidator implements Validator {

    @Override
    public boolean supports(Class<?> clazz) {
        return ProtocolParametersRequestForm.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ProtocolParametersRequestForm form = (ProtocolParametersRequestForm) target;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "network", "network.required");

        if (!errors.hasErrors()) {
            if (!GenericValidator.isInRange(form.getNetwork(),new Long(0),new Long(1))) {
                errors.rejectValue("network", "network.invalid");
            }
        }
    }
}